import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /attributes', () => {
  it('should all attributes', (done) => {
    chai.request(app)
      .get('/api/v1/attributes')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('attribute_id');
        expect(res.body[0]).to.have.property('name');
        done();
      });
  });
});

describe('GET /attributes/attribute_id', () => {
  it('should get a attributes details', (done) => {
    chai.request(app)
      .get(`/api/v1/attributes/1`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('attributeId');
        expect(res.body).to.have.property('name');
        done();
      });
  });

  it('should fail if attribute doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/attributes/5000`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ATT_01');
        expect(res.body.error.field).to.equal('attribute_id');
        expect(res.body.error.message).to.equal('Don\'t exist attribute with this ID');
        done();
      });
  });
});

describe('GET /attributes/values/attribute_id', () => {
  it('should get a attribute values', (done) => {
    chai.request(app)
      .get(`/api/v1/attributes/values/1`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('attribute_value_id');
        expect(res.body[0]).to.have.property('value');
        done();
      });
  });

  it('should fail if attribute doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/attributes/values/5000`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ATT_01');
        expect(res.body.error.field).to.equal('attribute_id');
        expect(res.body.error.message).to.equal('Don\'t exist attribute with this ID');
        done();
      });
  });
});

describe('GET /attributes/inProduct/product_id', () => {
  it('should get a attribute inProduct details', (done) => {
    chai.request(app)
      .get(`/api/v1/attributes/inProduct/1`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('attribute_name');
        expect(res.body[0]).to.have.property('attribute_value_id');
        expect(res.body[0]).to.have.property('attribute_value');
        done();
      });
  });

  it('should fail if product doesn\'t exist', (done) => {
    chai.request(app)
    .get(`/api/v1/attributes/inProduct/50000`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('PRD_02');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('Product not found');
        done();
      });
  });
});
