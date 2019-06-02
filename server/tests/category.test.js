import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /categories', () => {
  it('should all categories', (done) => {
    chai.request(app)
      .get('/api/v1/categories')
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body).to.be.an('array');
        // expect(res.body[0]).to.be.an('object');
        // expect(res.body[0]).to.have.property('department_id');
        // expect(res.body[0]).to.have.property('name');
        // expect(res.body[0]).to.have.property('description');
        done();
      });
  });
});

describe('GET /categories/category_id', () => {
  it('should get a categories details', (done) => {
    chai.request(app)
      .get('/api/v1/categories/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('departmentId');
        expect(res.body).to.have.property('categoryId');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('description');
        done();
      });
  });

  it('should fail if department doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/categories/5000')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('CAT_01');
        expect(res.body.error.field).to.equal('category_id');
        expect(res.body.error.message).to.equal('Don\'t exist category with this ID');
        done();
      });
  });
});

describe('GET /categories/inProduct/product_id', () => {
  it('should get a category inProduct details', (done) => {
    chai.request(app)
      .get('/api/v1/categories/inProduct/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('department_id');
        expect(res.body[0]).to.have.property('category_id');
        expect(res.body[0]).to.have.property('name');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/categories/inProduct/50000')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('PRD_02');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('Product not found');
        done();
      });
  });
});

describe('GET /categories/inDepartment/product_id', () => {
  it('should get a category inDepartment details', (done) => {
    chai.request(app)
      .get('/api/v1/categories/inDepartment/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('department_id');
        expect(res.body[0]).to.have.property('category_id');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('description');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/categories/inDepartment/50000')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('DEP_02');
        expect(res.body.error.field).to.equal('department_id');
        expect(res.body.error.message).to.equal('Don\'t exist department with this ID');
        done();
      });
  });
});
