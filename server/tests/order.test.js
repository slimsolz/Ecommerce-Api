import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { ShoppingCart } from '../models';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

const customer = {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password()
};

let cart_id;
let item_id;
let order_id;
let token = '';

before((done) => {
  chai.request(app)
    .post('/api/v1/customers')
    .send({
      name: customer.name,
      email: customer.email,
      password: customer.password
    })
    .end((err, res) => {
      token = res.body.accessToken;
      done();
    });
});

before((done) => {
  chai.request(app)
    .get('/api/v1/shoppingcart/generateUniqueId')
    .end((err, res) => {
      cart_id = res.body.cart_id;
      done();
    });
});

before((done) => {
  ShoppingCart.destroy({ truncate: true });
  chai.request(app)
    .post('/api/v1/shoppingcart/add')
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
});

before((done) => {
  chai.request(app)
    .get(`/api/v1/shoppingcart/moveToCart/${item_id}`)
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});

describe('POST /orders', () => {
  it('should successfully create an order from a shopping cart', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .set('USER-KEY', token)
      .send({
        cart_id,
        shipping_id: 1,
        tax_id: 1
      })
      .end((err, res) => {
        order_id = res.body[0].orderId;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('orderId');
        done();
      });
  });
});

describe('GET /orders/{order_id', () => {
  it('should successfully get order info', (done) => {
    chai.request(app)
      .get('/api/v1/orders/inCustomer')
      .set('USER-KEY', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('order_id');
        expect(res.body[0]).to.have.property('total_amount');
        expect(res.body[0]).to.have.property('shipped_on');
        expect(res.body[0]).to.have.property('name');
        done();
      });
  });
});

describe('GET /orders/{order_id', () => {
  it('should successfully get order info', (done) => {
    chai.request(app)
      .get(`/api/v1/orders/${order_id}`)
      .set('USER-KEY', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('order_id');
        expect(res.body[0]).to.have.property('total_amount');
        expect(res.body[0]).to.have.property('tax_id');
        expect(res.body[0]).to.have.property('customer_id');
        done();
      });
  });

  it('should fail if order doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/orders/500000')
      .set('USER-KEY', token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ORD_02');
        expect(res.body.error.field).to.equal('order_id');
        expect(res.body.error.message).to.equal('Order not found');
        done();
      });
  });
});

describe('GET /orders/shortDetails/{order_id', () => {
  it('should successfully get order info', (done) => {
    chai.request(app)
      .get(`/api/v1/orders/shortDetails/${order_id}`)
      .set('USER-KEY', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('order_id');
        expect(res.body[0]).to.have.property('total_amount');
        expect(res.body[0]).to.have.property('shipped_on');
        expect(res.body[0]).to.have.property('name');
        done();
      });
  });

  it('should fail if order doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/orders/shortDetails/500000')
      .set('USER-KEY', token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.code).to.equal('ORD_02');
        expect(res.body.error.field).to.equal('order_id');
        expect(res.body.error.message).to.equal('Order not found');
        done();
      });
  });
});
