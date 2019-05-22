import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { Customer } from '../models';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

const customer = {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
};

const customer2 = {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
  address1: '',
  address2: '',
  city: '',
  region: '',
  postalCode: '',
  country: '',
  shippingRegionId: '',
  creditCard: '',
  dayPhone: '',
  evePhone: '',
  mobPhone: '',
}

let token = '';

before((done) => {
  Customer.destroy({ truncate: true });
  chai.request(app)
    .post('/api/v1/customers')
    .send({
      name: customer2.name,
      email: customer2.email,
      password: customer2.password
    })
    .end((err, res) => {
      token = res.body.accessToken;
      done();
    });
});

describe('POST /customers', () => {
  it('should register a new customer', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send(customer)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.customer.name).to.equal(customer.name);
        expect(res.body.customer.email).to.equal(customer.email);
        expect(res.body).to.have.property('accessToken');
        expect(res.body.expires_in).to.equal('24h');
        done();
      });
  });

  it('should return 409 if email exists', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send(customer)
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.error.code).to.equal('USR_04');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('The email already exists');
        done();
      });
  });
});

describe('POST /customers/login', () => {
  it('should successfully login a customer', (done) => {
    chai.request(app)
      .post('/api/v1/customers/login')
      .send({
        email: customer.email,
        password: customer.password
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.customer.name).to.equal(customer.name);
        expect(res.body.customer.email).to.equal(customer.email);
        expect(res.body).to.have.property('accessToken');
        expect(res.body.expires_in).to.equal('24h');
        done();
      });
  });

  it('should fail if email is wrong', (done) => {
    chai.request(app)
      .post('/api/v1/customers/login')
      .send({
        email: faker.internet.email(),
        password: customer.password
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_01');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('Email or Password is invalid');
        done();
      });
  });

  it('should fail if password is wrong', (done) => {
    chai.request(app)
      .post('/api/v1/customers/login')
      .send({
        email: customer.email,
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_01');
        expect(res.body.error.field).to.equal('password');
        expect(res.body.error.message).to.equal('Email or Password is invalid');
        done();
      });
  });
});

describe('GET /customers', () => {
  it('should successfully retrieve a customers info', (done) => {
    chai.request(app)
      .get('/api/v1/customers')
      .set('USER-KEY', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('PUT /customers', () => {
  it('should successfully update a customers info when all data is provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: customer2.email,
        name: customer2.name,
        password: faker.internet.password(),
        day_phone: faker.phone.phoneNumber(),
        eve_phone: faker.phone.phoneNumber(),
        mob_phone: faker.phone.phoneNumber(),
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.customer.name).to.equal(customer2.name);
        expect(res.body.customer.email).to.equal(customer2.email);
        expect(res.body.customer.day_phone).to.be.a('string');
        expect(res.body.customer.eve_phone).to.be.a('string');
        expect(res.body.customer.mob_phone).to.be.a('string');
        done();
      });
  });

  it('should successfully update a customers info when some data are not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: customer2.email,
        name: customer2.name
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.customer.name).to.equal(customer2.name);
        expect(res.body.customer.email).to.equal(customer2.email);
        done();
      });
  });

  it('should successfully update a customers address info when all data is provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.customer.address_1).to.be.a('string');
        expect(res.body.customer.address_2).to.be.a('string');
        expect(res.body.customer.city).to.be.a('string');
        expect(res.body.customer.region).to.be.a('string');
        expect(res.body.customer.postal_code).to.be.a('string');
        expect(res.body.customer.country).to.be.a('string');
        expect(res.body.customer.shipping_region_id).to.be.a('number');
        done();
      });
  });

  it('should successfully update a customers address info when some data are not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.customer.address_1).to.be.a('string');
        expect(res.body.customer.city).to.be.a('string');
        expect(res.body.customer.region).to.be.a('string');
        expect(res.body.customer.postal_code).to.be.a('string');
        expect(res.body.customer.country).to.be.a('string');
        expect(res.body.customer.shipping_region_id).to.be.a('number');
        done();
      });
  });

  it('should successfully update a customers credit card', (done) => {
    chai.request(app)
      .put('/api/v1/customers/creditCard')
      .set('USER-KEY', token)
      .send({
        credit_card: '1234568890854645'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.customer.credit_card).to.be.a('string');
        done();
      });
  });
});
