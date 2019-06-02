import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

const customer1 = {
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
};

let token = '';

before((done) => {
  chai.request(app)
    .post('/api/v1/customers')
    .send({
      name: customer1.name,
      email: customer1.email,
      password: customer1.password
    })
    .end((err, res) => {
      token = res.body.accessToken;
      done();
    });
});
describe('authentication', () => {
  it('should return 401, User not logged in', (done) => {
    chai.request(app)
      .get('/api/v1/customers')
      .set('USER-KEY', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTI3MTM3NjQ2LCJleHAiOjE1MjcyMjQwNDZ9.0J2YZ8LAUpEnauDvl21U2OjHIQjRBzR70PlLVvNPD9o')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error.code).to.equal('AUT_02');
        expect(res.body.error.field).to.equal('API-KEY');
        expect(res.body.error.message).to.equal('The apikey is invalid');
        done();
      });
  });
  it('should return 401, api key is not set', (done) => {
    chai.request(app)
      .get('/api/v1/customers')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error.code).to.equal('AUT_02');
        expect(res.body.error.field).to.equal('NoAuth');
        expect(res.body.error.message).to.equal('Access Unauthorized');
        done();
      });
  });
});

describe('register validation', () => {
  it('should fail if email in not provided', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send({
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if email is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send({
        email: 'wrongemail',
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('The email is invalid');
        done();
      });
  });

  it('should fail if name is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('name');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if name is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send({
        email: faker.internet.email(),
        name: 1234,
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('name');
        expect(res.body.error.message).to.equal('The name is invalid');
        done();
      });
  });

  it('should fail if password is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send({
        email: faker.internet.email(),
        name: faker.name.findName()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('password');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if password is not long enough', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: '1234567'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('password');
        expect(res.body.error.message).to.equal('password must be at least 8 characters long');
        done();
      });
  });
});

describe('login validation', () => {
  it('should fail if email in not provided', (done) => {
    chai.request(app)
      .post('/api/v1/customers/login')
      .send({
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if email is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/customers/login')
      .send({
        email: 'wrongemail',
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('The email is invalid');
        done();
      });
  });

  it('should fail if password is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/customers/login')
      .send({
        email: faker.internet.email(),
        name: faker.name.findName()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('password');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if password is not long enough', (done) => {
    chai.request(app)
      .post('/api/v1/customers/login')
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: '1234567'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('password');
        expect(res.body.error.message).to.equal('password must be at least 8 characters long');
        done();
      });
  });
});

describe('update customer validation', () => {
  it('should fail if email in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if email is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: 'wrongemail',
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('email');
        expect(res.body.error.message).to.equal('The email is invalid');
        done();
      });
  });

  it('should fail if name is not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('name');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if name is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: faker.internet.email(),
        name: 1234,
        password: faker.internet.password()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('name');
        expect(res.body.error.message).to.equal('The name is invalid');
        done();
      });
  });

  it('should fail if password is not long enough', (done) => {
    chai.request(app)
      .post('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: '1234567'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('password');
        expect(res.body.error.message).to.equal('password must be at least 8 characters long');
        done();
      });
  });

  it('should fail if day_phone is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password(),
        day_phone: 1234
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('day_phone');
        expect(res.body.error.message).to.equal('day phone is invalid');
        done();
      });
  });

  it('should fail if eve_phone is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password(),
        eve_phone: 1234
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('eve_phone');
        expect(res.body.error.message).to.equal('eve phone is invalid');
        done();
      });
  });

  it('should fail if mob_phone is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers')
      .set('USER-KEY', token)
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password(),
        mob_phone: 1234
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('mob_phone');
        expect(res.body.error.message).to.equal('mob phone is invalid');
        done();
      });
  });
});

describe('update customer validation', () => {
  it('should fail if address_1 in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('address_1');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if address_1 is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: 1234,
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('address_1');
        expect(res.body.error.message).to.equal('The address_1 is invalid');
        done();
      });
  });

  it('should fail if address_2 is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: 1234,
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('address_2');
        expect(res.body.error.message).to.equal('The address_2 is invalid');
        done();
      });
  });

  it('should fail if city in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('city');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if city is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: 123,
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('city');
        expect(res.body.error.message).to.equal('The city is invalid');
        done();
      });
  });

  it('should fail if region in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('region');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if region is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        region: 123,
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('region');
        expect(res.body.error.message).to.equal('The region is invalid');
        done();
      });
  });

  it('should fail if postal_code in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('postal_code');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if postal_code is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: 123,
        country: faker.address.country(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('postal_code');
        expect(res.body.error.message).to.equal('The postal_code is invalid');
        done();
      });
  });

  it('should fail if country in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('country');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if country is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: 1234,
        shipping_region_id: 3,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('country');
        expect(res.body.error.message).to.equal('The country is invalid');
        done();
      });
  });

  it('should fail if shipping_region_id in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('shipping_region_id');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if shipping_region_id is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/address')
      .set('USER-KEY', token)
      .send({
        address_1: faker.address.streetAddress(),
        address_2: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.city(),
        postal_code: faker.address.countryCode(),
        country: faker.address.country(),
        shipping_region_id: 'wrong',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('shipping_region_id');
        expect(res.body.error.message).to.equal('The shipping_region_id is invalid');
        done();
      });
  });

  it('should fail if credit_card in not provided', (done) => {
    chai.request(app)
      .put('/api/v1/customers/creditCard')
      .set('USER-KEY', token)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('credit_card');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if credit_card is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/customers/creditCard')
      .set('USER-KEY', token)
      .send({
        credit_card: faker.random.number()
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('credit_card');
        expect(res.body.error.message).to.equal('The credit_card is invalid');
        done();
      });
  });
});

describe('params validation', () => {
  it('should fail if params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/products/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('PRD_1');
        expect(res.body.error.field).to.equal('product_id');
        expect(res.body.error.message).to.equal('The product_id is not a number');
        done();
      })
  });
});

describe('category params validation', () => {
  it('should fail if category params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/products/inCategory/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('CAT_1');
        expect(res.body.error.field).to.equal('category_id');
        expect(res.body.error.message).to.equal('The category_id is not a number');
        done();
      })
  });
});

describe('department params validation', () => {
  it('should fail if department params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/products/inDepartment/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('DPT_1');
        expect(res.body.error.field).to.equal('department_id');
        expect(res.body.error.message).to.equal('The department_id is not a number');
        done();
      })
  });
});

describe('update review validation', () => {
  it('should fail if review in not provided', (done) => {
    chai.request(app)
      .post('/api/v1/products/1/reviews')
      .set('USER-KEY', token)
      .send({
        rating: 1
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('review');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if review is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/products/1/reviews')
      .set('USER-KEY', token)
      .send({
        review: 123,
        rating: 1
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('review');
        expect(res.body.error.message).to.equal('The review is invalid');
        done();
      });
  });

  it('should fail if rating in not provided', (done) => {
    chai.request(app)
      .post('/api/v1/products/1/reviews')
      .set('USER-KEY', token)
      .send({
        review: 'sweet'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_02');
        expect(res.body.error.field).to.equal('rating');
        expect(res.body.error.message).to.equal('The field is required');
        done();
      });
  });

  it('should fail if rating is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/products/1/reviews')
      .set('USER-KEY', token)
      .send({
        review: 'good',
        rating: 'good'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('USR_03');
        expect(res.body.error.field).to.equal('rating');
        expect(res.body.error.message).to.equal('The rating is invalid');
        done();
      });
  });
});

describe('attribute params validation', () => {
  it('should fail if attribute params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/attributes/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('ATT_02');
        expect(res.body.error.field).to.equal('attribute_id');
        expect(res.body.error.message).to.equal('The attribute_id is not a number');
        done();
      })
  });
});

describe('tax params validation', () => {
  it('should fail if tax params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/taxes/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('TAX_02');
        expect(res.body.error.field).to.equal('tax_id');
        expect(res.body.error.message).to.equal('The tax_id is not a number');
        done();
      })
  });
});

describe('params validation', () => {
  it('should fail if shipping region params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/shipping/regions/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('SHP_02');
        expect(res.body.error.field).to.equal('shipping_region_id');
        expect(res.body.error.message).to.equal('The shipping_region_id is not a number');
        done();
      })
  });

  it('should fail if item params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/shoppingcart/moveToCart/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('ITM_01');
        expect(res.body.error.field).to.equal('item_id');
        expect(res.body.error.message).to.equal('The item_id is not a number');
        done();
      })
  });

  it('should fail if order params isn\'t an integer', (done) => {
    chai.request(app)
      .get('/api/v1/orders/wer')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error.code).to.equal('ORD_01');
        expect(res.body.error.field).to.equal('order_id');
        expect(res.body.error.message).to.equal('The order_id is not a number');
        done();
      })
  });
});
