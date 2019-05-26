import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

const product_id = 1;

const customer = {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
};

let token = '';

before((done) => {
  chai.request(app)
    .post('/api/v1/customers')
    .send(customer)
    .end((err, res) => {
      token = res.body.accessToken;
      done();
    });
});

describe('GET /products', () => {
  it('should get some product', (done) => {
    chai.request(app)
      .get('/api/v1/products')
      .end((err, res) => {
        expect(res).to.have.status(206);
        expect(res.body.rows[0]).to.have.property('name');
        expect(res.body.rows[0]).to.have.property('description');
        expect(res.body.rows[0]).to.have.property('price');
        expect(res.body.rows[0]).to.have.property('thumbnail');
        expect(res.body.rows[0]).to.have.property('discounted_price');
        done();
      });
  });

  it('should get some products', (done) => {
    chai.request(app)
      .get('/api/v1/products?page=2&limit=10&description_length=30')
      .end((err, res) => {
        expect(res).to.have.status(206);
        done();
      });
  });

  it('should get a single product', (done) => {
    chai.request(app)
      .get(`/api/v1/products/${product_id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.productId).to.equal(product_id);
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('thumbnail');
        expect(res.body).to.have.property('display');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/products/5000`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('PRD_2');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('Product not found');
        done();
      });
  });
});

describe('GET /products/id/details', () => {
  it('should get a product details', (done) => {
    chai.request(app)
      .get(`/api/v1/products/${product_id}/details`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.productId).to.equal(product_id);
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('discountedPrice');
        expect(res.body).to.have.property('image');
        expect(res.body).to.have.property('image2');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/products/5000/details`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('PRD_2');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('Product not found');
        done();
      });
  });
});

describe('GET /products/id/locations', () => {
  it('should get a product details', (done) => {
    chai.request(app)
      .get(`/api/v1/products/${product_id}/locations`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property('category_id');
        expect(res.body[0]).to.have.property('category_name');
        expect(res.body[0]).to.have.property('department_id');
        expect(res.body[0]).to.have.property('department_name');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/products/5000/locations`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('PRD_2');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('Product not found');
        done();
      });
  });
});

describe('GET /products/id/reviews', () => {
  it('should get a product reviews', (done) => {
    chai.request(app)
      .get(`/api/v1/products/5/reviews`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.eql('No review at the moment');
        done();
      });
  });

  it('should add a product review', (done) => {
    chai.request(app)
      .post(`/api/v1/products/${product_id}/reviews`)
      .set('USER-KEY', token)
      .send({
        review: 'great',
        rating: 43
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should get a product reviews', (done) => {
    chai.request(app)
      .get(`/api/v1/products/${product_id}/reviews`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('review');
        expect(res.body[0]).to.have.property('rating');
        expect(res.body[0]).to.have.property('created_on');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/products/5000/reviews`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('PRD_2');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('Product not found');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
      .post(`/api/v1/products/5000/reviews`)
      .set('USER-KEY', token)
      .send({
        review: 'awesome',
        rating: 3
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('PRD_2');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('Product not found');
        done();
      });
  });
});

describe('GET /products/inCategory/:categoryId', () => {
  it('should get a product in a category', (done) => {
    chai.request(app)
    .get(`/api/v1/products/inCategory/1`)
      .end((err, res) => {
        expect(res).to.have.status(206);
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('rows');
        done();
      });
  });

  it('should get a product in a category', (done) => {
    chai.request(app)
    .get(`/api/v1/products/inCategory/1?page=2&limit=5&description_length=16`)
      .end((err, res) => {
        expect(res).to.have.status(206);
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('rows');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
    .get('/api/v1/products/inCategory/5000')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('CAT_1');
        expect(res.body.error.message).to.equal('Don\'t exist category with this ID');
        expect(res.body.error.field).to.equal('category_id');
        done();
      });
  });
});

describe('GET /products/inDepartment/:departmentId', () => {
  it('should get a product in a department', (done) => {
    chai.request(app)
    .get(`/api/v1/products/inDepartment/1`)
      .end((err, res) => {
        expect(res).to.have.status(206);
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('rows');
        done();
      });
  });

  it('should get a product in a department', (done) => {
    chai.request(app)
    .get(`/api/v1/products/inDepartment/1?page=2&limit=5&description_length=16`)
      .end((err, res) => {
        expect(res).to.have.status(206);
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('rows');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
    .get('/api/v1/products/inDepartment/5000')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('DPT_1');
        expect(res.body.error.message).to.equal('Don\'t exist department with this ID');
        expect(res.body.error.field).to.equal('department_id');
        done();
      });
  });
});

describe('GET /products/search', () => {
  it('should get some product', (done) => {
    chai.request(app)
      .get('/api/v1/products/search?query_string=fish')
      .end((err, res) => {
        expect(res).to.have.status(206);
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('rows');
        done();
      });
  });

  it('should fail if query_string in not provided', (done) => {
    chai.request(app)
    .get('/api/v1/products/search')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('QRY_01');
        expect(res.body.error.field).to.equal('query_string');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should get some products/search', (done) => {
    chai.request(app)
      .get('/api/v1/products/search?query_string=fish&all_words=on&description_length=30&limit=10&page=2')
      .end((err, res) => {
        expect(res).to.have.status(206);
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('rows');
        done();
      });
  });
});
