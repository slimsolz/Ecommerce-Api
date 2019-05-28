import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

let cart_id;
let cart_id2;
let item_id;

before((done) => {
  chai.request(app)
  .get('/api/v1/shoppingcart/generateUniqueId')
  .end((err, res) => {
    cart_id = res.body.cart_id
    done();
  });
});

before((done) => {
  chai.request(app)
    .post(`/api/v1/shoppingcart/add`)
    .send({
      cartId: cart_id,
      product_id: 1,
      attributes: 'S, Red',
      quantity: 1
    })
    .end((err, res) => {
      item_id = res.body.item_id;
      expect(res).to.have.status(201);
      done();
    });
})

describe('GET /shoppingcart', () => {
  it('should get all shopping_cart', (done) => {
    chai.request(app)
      .get('/api/v1/shoppingcart/generateUniqueId')
      .end((err, res) => {
        cart_id2 = res.body.cart_id
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('cart_id');
        done();
      });
  });
});

describe('POST /shoppingcart/add', () => {
  it('should add a product to shopping cart', (done) => {
    chai.request(app)
      .post(`/api/v1/shoppingcart/add`)
      .send({
        cartId: cart_id2,
        product_id: 1,
        attributes: 'S, Blue',
        quantity: 1
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
    .post(`/api/v1/shoppingcart/add`)
    .send({
      cartId: cart_id2,
      product_id: 5000,
      attributes: 'S, Blue',
      quantity: 1
    })
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body.error.code).to.equal('PRD_2');
      expect(res.body.error.field).to.equal('product_id');
      expect(res.body.error.message).to.equal('Product not found');
      done();
    });
  });

  it('should add a product to shopping cart', (done) => {
    chai.request(app)
      .post(`/api/v1/shoppingcart/add`)
      .send({
        cartId: cart_id2,
        product_id: 2,
        attributes: 'XX, Red',
        quantity: 1
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
});

describe('GET /shoppingcart/{cart_id}', () => {
  it('should successfully get shopping_cart', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/${cart_id2}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('item_id');
        done();
      });
  });

  it('should fail to get shopping_cart', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/aulfh3naow3sfludun`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('CRT_02');
        expect(res.body.error.field).to.equal('cart_id');
        expect(res.body.error.message).to.equal('No cart available for the shopping_cart_id');
        done();
      });
  });
});

describe('PUT /shoppingcart/update/{item_id}', () => {
  it('should successfully update shopping_cart', (done) => {
    chai.request(app)
      .put(`/api/v1/shoppingcart/update/${item_id}`)
      .send({ quantity: 5 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should fail to update shopping_cart', (done) => {
    chai.request(app)
      .put(`/api/v1/shoppingcart/update/aulfh3naow3sfludun`)
      .send({ quantity: 5 })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ITM_02');
        expect(res.body.error.field).to.equal('item_id');
        expect(res.body.error.message).to.equal('No item found');
        done();
      });
  });
});

describe('DELETE /shoppingcart/empty/{item_id}', () => {
  it('should successfully empty shopping_cart', (done) => {
    chai.request(app)
      .delete(`/api/v1/shoppingcart/empty/${cart_id2}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should fail to empty cart', (done) => {
    chai.request(app)
      .delete(`/api/v1/shoppingcart/empty/aulfh3naow3sfludun`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('CRT_02');
        expect(res.body.error.field).to.equal('cart_id');
        expect(res.body.error.message).to.equal('No Cart found');
        done();
      });
  });
});

describe('GET /shoppingcart/moveToCart/{item_id}', () => {
  it('should successfully move to cart', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/moveToCart/${item_id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should fail to move to cart', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/moveToCart/aulfh3naow3sfludun`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ITM_02');
        expect(res.body.error.field).to.equal('item_id');
        expect(res.body.error.message).to.equal('No item found');
        done();
      });
  });
});

describe('GET /shoppingcart/totalAmount/{cart_id}', () => {
  it('should successfully get total amount', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/totalAmount/${cart_id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('total_amount');
        done();
      });
  });

  it('should fail if shopping_cart id is not available', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/totalAmount/aulfh3naow3sfludun`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('CRT_02');
        expect(res.body.error.field).to.equal('cart_id');
        expect(res.body.error.message).to.equal('No cart available for the shopping_cart_id');
        done();
      });
  });
});

describe('GET /shoppingcart/saveForLater/{item_id}', () => {
  it('should successfully save for later', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/saveForLater/${item_id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should fail to save for later shopping_cart', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/saveForLater/aulfh3naow3sfludun`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ITM_02');
        expect(res.body.error.field).to.equal('item_id');
        expect(res.body.error.message).to.equal('No item found');
        done();
      });
  });
});

describe('GET /shoppingcart/getSaved/{cart_id}', () => {
  it('should successfully get saved items', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/getSaved/${cart_id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should fail to get saved', (done) => {
    chai.request(app)
      .get(`/api/v1/shoppingcart/getSaved/aulfh3naow3sfludun`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('CRT_02');
        expect(res.body.error.field).to.equal('cart_id');
        expect(res.body.error.message).to.equal('No cart available for the shopping_cart_id');
        done();
      });
  });
});

describe('GET /shoppingcart/removeProduct/{item_id}', () => {
  it('should successfully remove product', (done) => {
    chai.request(app)
      .delete(`/api/v1/shoppingcart/removeProduct/${item_id}`)
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });

  it('should fail to remove product', (done) => {
    chai.request(app)
      .delete(`/api/v1/shoppingcart/removeProduct/aulfh3naow3sfludun`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ITM_02');
        expect(res.body.error.field).to.equal('item_id');
        expect(res.body.error.message).to.equal('No item found');
        done();
      });
  });
});
