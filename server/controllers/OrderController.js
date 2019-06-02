import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';

const { Orders } = Model;

require('dotenv').config();

export default class OrderController {
  /**
   * @description - create order
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof OrderController
   *
   * @returns {Promise<object>}
   */
  static createOrder(req, res) {
    const { cart_id, shipping_id, tax_id } = req.body;
    const { customerId } = req;

    Model.sequelize.query(
      `CALL shopping_cart_create_order('${cart_id}', ${customerId}, ${shipping_id}, ${tax_id})`
    ).then(order => res.json(order));
  }

  /**
   * @description - get order info
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof OrderController
   *
   * @returns {Promise<object>}
   */
  static getOrderInfo(req, res) {
    const { order_id } = req.params;

    Orders.findOne({ where: { orderId: order_id } })
      .then((order) => {
        if (!order) {
          return errorResponse(res, 404, 'ORD_02', 'Order not found', 'order_id');
        }
        Model.sequelize.query(`CALL orders_get_order_info(${order_id})`)
          .then(orderInfo => res.json(orderInfo));
      });
  }

  /**
   * @description - get order by customers
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof OrderController
   *
   * @returns {Promise<object>}
   */
  static getOrderByCustomer(req, res) {
    const { customerId } = req;

    Model.sequelize.query(`CALL orders_get_by_customer_id(${customerId})`)
      .then(order => res.json(order));
  }

  /**
   * @description - get order details
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof OrderController
   *
   * @returns {Promise<object>}
   */
  static getOrderDetails(req, res) {
    const { order_id } = req.params;

    Orders.findOne({ where: { orderId: order_id } })
      .then((order) => {
        if (!order) {
          return errorResponse(res, 404, 'ORD_02', 'Order not found', 'order_id');
        }
        Model.sequelize.query(`CALL orders_get_order_short_details(${order_id})`)
          .then(orderDetails => res.json(orderDetails));
      });
  }
}
