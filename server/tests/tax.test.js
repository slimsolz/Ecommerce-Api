import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /taxes', () => {
  it('should all taxes', (done) => {
    chai.request(app)
      .get('/api/v1/taxes')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('taxId');
        expect(res.body[0]).to.have.property('taxType');
        expect(res.body[0]).to.have.property('taxPercentage');
        done();
      });
  });
});

describe('GET /taxes/tax_id', () => {
  it('should get a taxes details', (done) => {
    chai.request(app)
      .get(`/api/v1/taxes/1`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('taxId');
        expect(res.body).to.have.property('taxType');
        expect(res.body).to.have.property('taxPercentage');
        done();
      });
  });

  it('should fail if tax doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/taxes/5000`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('TAX_01');
        expect(res.body.error.field).to.equal('tax_id');
        expect(res.body.error.message).to.equal('Don\'t exist tax with this ID');
        done();
      });
  });
});
