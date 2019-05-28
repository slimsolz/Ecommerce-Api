import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /shipping/regions', () => {
  it('should all shipping/regions', (done) => {
    chai.request(app)
      .get('/api/v1/shipping/regions')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('shipping_region_id');
        expect(res.body[0]).to.have.property('shipping_region');
        done();
      });
  });
});

describe('GET /shipping/regions/shipping_region_id', () => {
  it('should get a list of shipping regions', (done) => {
    chai.request(app)
      .get(`/api/v1/shipping/regions/2`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('shippingId');
        expect(res.body[0]).to.have.property('shippingCost');
        expect(res.body[0]).to.have.property('shippingRegionId');
        done();
      });
  });

  it('should fail if shipping region doesn\'t exist', (done) => {
    chai.request(app)
      .get(`/api/v1/shipping/regions/5000`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('SHR_01');
        expect(res.body.error.field).to.equal('shipping_region_id');
        expect(res.body.error.message).to.equal('Don\'t exist shipping region with this ID');
        done();
      });
  });
});
