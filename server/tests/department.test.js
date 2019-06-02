import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /departments', () => {
  it('should department list', (done) => {
    chai.request(app)
      .get('/api/v1/departments')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('department_id');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('description');
        done();
      });
  });
});

describe('GET /departments/department_id', () => {
  it('should get a department details', (done) => {
    chai.request(app)
      .get('/api/v1/departments/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('departmentId');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('description');
        done();
      });
  });

  it('should fail if department doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/departments/5000')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('DEP_02');
        expect(res.body.error.field).to.equal('department_id');
        expect(res.body.error.message).to.equal('Don\'t exist department with this ID');
        done();
      });
  });
});
