import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../helpers/encrypt';
import { successResponse, successResponseWithToken, errorResponse } from '../helpers/responseHelper';
import Model from '../models';

const { Customer } = Model;

require('dotenv').config();

export default class CustomerController {
  /**
   * @description - Register a new customer
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CustomerController
   *
   * @returns {Promise<object>}
   */
  static register(req, res) {
    const { name, email, password } = req.body;

    Customer.findOne({ where: { email: email.toLowerCase() } })
      .then((foundCustomer) => {
        if (foundCustomer) {
          errorResponse(res, 409, 'USR_04', 'The email already exists', 'email');
        } else {
          const hashedPassword = hashPassword(password);
          Customer.create({
            name,
            email,
            password: hashedPassword
          }).then((customer) => {
            const token = jwt.sign({ id: customer.customerId }, process.env.SECRET, { expiresIn: '24h' });
            successResponseWithToken(res, 201, customer, token);
          });
        }
      });
  }

  /**
   * @description - Login a customer
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CustomerController
   *
   * @returns {Promise<object>}
   */
  static login(req, res) {
    const { email, password } = req.body;

    Customer.findOne({ where: { email: email.toLowerCase() } })
      .then((customer) => {
        if (!customer) {
          errorResponse(res, 400, 'USR_01', 'Email or Password is invalid', 'email');
        } else {
          const confirmPassword = verifyPassword(password, customer.password);
          if (confirmPassword) {
            const token = jwt.sign({ id: customer.customerId }, process.env.SECRET, { expiresIn: '24h' });
            successResponseWithToken(res, 200, customer, token);
          } else {
            errorResponse(res, 400, 'USR_01', 'Email or Password is invalid', 'password');
          }
        }
      });
  }

  /**
   * @description - Login a customer
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CustomerController
   *
   * @returns {Promise<object>}
   */
  static getCustomer(req, res) {
    const { customerId } = req;
    Model.sequelize.query(`CALL customer_get_customer(${customerId})`)
      .then(customer => res.json(customer));
  }

  /**
   * @description - Update a customer
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CustomerController
   *
   * @returns {Promise<object>}
   */
  static updateCustomer(req, res) {
    const { customerId } = req;
    const {
      name, email, password, day_phone, eve_phone, mob_phone
    } = req.body;

    Customer.findOne({ where: { customerId } })
      .then((customer) => {
        const hashedPassword = password ? hashPassword(password) : customer.password;
        const dayPhone = day_phone || customer.dayPhone;
        const evePhone = eve_phone || customer.evePhone;
        const mobPhone = mob_phone || customer.mobPhone;

        customer.update({
          name,
          email,
          password: hashedPassword,
          dayPhone,
          evePhone,
          mobPhone
        }).then((updatedCustomer) => {
          successResponse(res, 200, updatedCustomer);
        });
      });
  }

  /**
   * @description - Update a customer address
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CustomerController
   *
   * @returns {Promise<object>}
   */
  static updateCustomerAddress(req, res) {
    const { customerId } = req;
    const {
      address_1, address_2, city, region, postal_code, country, shipping_region_id
    } = req.body;

    Customer.findOne({ where: { customerId } })
      .then((customer) => {
        const address2 = address_2 || address2;

        customer.update({
          address1: address_1,
          address2,
          city,
          region,
          postalCode: postal_code,
          shippingRegionId: shipping_region_id,
          country,
        }).then((updatedCustomer) => {
          successResponse(res, 200, updatedCustomer);
        });
      });
  }

  /**
   * @description - Update a customers credit card
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CustomerController
   *
   * @returns {Promise<object>}
   */
  static updateCustomerCreditCard(req, res) {
    const { customerId } = req;
    const { credit_card } = req.body;

    Customer.findOne({ where: { customerId } })
      .then((customer) => {
        customer.update({
          creditCard: credit_card
        }).then((updatedCustomer) => {
          successResponse(res, 200, updatedCustomer);
        });
      });
  }
}
