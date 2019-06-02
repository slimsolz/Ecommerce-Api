import randomstring from 'randomstring';
import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';

const { Product, ShoppingCart } = Model;

require('dotenv').config();

export default class ShoppingCartController {
  /**
   * @description - Generate unique card id
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static generateUniqueId(req, res) {
    const cart_id = randomstring.generate(30);
    return res.json({ cart_id });
  }

  /**
   * @description - add product to cart
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static addProductToCart(req, res) {
    const {
      cartId, product_id, attributes, quantity
    } = req.body;
    const addedOn = Date.now();

    Product.findOne({ where: { product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_2', 'Product not found', 'product_id');
        }
        ShoppingCart.create({
          cartId,
          productId: product_id,
          attributes,
          quantity,
          addedOn
        })
          .then((addedProduct) => {
            let price = product.price;
            if (product.discountedPrice > 0) price = product.discountedPrice;
            return res.status(201).json({
              item_id: addedProduct.itemId,
              name: product.name,
              attributes: addedProduct.attributes,
              product_id,
              image: product.image,
              price,
              quantity: addedProduct.quantity,
              subtotal: (price * quantity)
            });
          });
      });
  }

  /**
   * @description - view cart list
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static getShoppingCartList(req, res) {
    const { cart_id } = req.params;

    Model.sequelize.query(`CALL shopping_cart_get_products('${cart_id}');`)
      .then((shoppingCartList) => {
        if (shoppingCartList.length === 0) {
          return errorResponse(res, 404, 'CRT_02', 'No cart available for the shopping_cart_id', 'cart_id');
        }

        return res.json(shoppingCartList);
      });
  }

  /**
   * @description - update cart
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static updateShoppingCartList(req, res) {
    const { item_id } = req.params;
    const { quantity } = req.body;

    ShoppingCart.findOne({ where: { itemId: item_id } })
      .then((item) => {
        if (!item) {
          return errorResponse(res, 404, 'ITM_02', 'No item found', 'item_id');
        }
        Model.sequelize.query(`CALL shopping_cart_update(${item_id}, ${quantity});`)
          .then(() => res.json());
      });
  }

  /**
   * @description - empty update cart
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static emptyShoppingCart(req, res) {
    const { cart_id } = req.params;

    ShoppingCart.findOne({ where: { cartId: cart_id } })
      .then((sCart) => {
        if (!sCart) {
          return errorResponse(res, 404, 'CRT_02', 'No Cart found', 'cart_id');
        }
        Model.sequelize.query(`CALL shopping_cart_empty('${cart_id}');`)
          .then(() => res.status(200).json([]));
      });
  }

  /**
   * @description - move to cart
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static moveToCart(req, res) {
    const { item_id } = req.params;

    ShoppingCart.findOne({ where: { itemId: item_id } })
      .then((item) => {
        if (!item) {
          return errorResponse(res, 404, 'ITM_02', 'No item found', 'item_id');
        }
        Model.sequelize.query(`CALL shopping_cart_move_product_to_cart(${item_id});`)
          .then(() => res.json());
      });
  }

  /**
   * @description - get total cart amount
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static getTotalAmount(req, res) {
    const { cart_id } = req.params;

    ShoppingCart.findOne({ where: { cartId: cart_id } })
      .then((cart) => {
        if (!cart) {
          return errorResponse(res, 404, 'CRT_02', 'No cart available for the shopping_cart_id', 'cart_id');
        }
        Model.sequelize.query(`CALL shopping_cart_get_total_amount('${cart_id}');`)
          .then(totalAmount => res.json(totalAmount));
      });
  }

  /**
   * @description - save for later
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static saveForLater(req, res) {
    const { item_id } = req.params;

    ShoppingCart.findOne({ where: { itemId: item_id } })
      .then((item) => {
        if (!item) {
          return errorResponse(res, 404, 'ITM_02', 'No item found', 'item_id');
        }
        Model.sequelize.query(`CALL shopping_cart_save_product_for_later(${item_id});`)
          .then(() => res.json());
      });
  }

  /**
   * @description - get saved cart
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static getSaved(req, res) {
    const { cart_id } = req.params;

    ShoppingCart.findOne({ where: { cartId: cart_id } })
      .then((cart) => {
        if (!cart) {
          return errorResponse(res, 404, 'CRT_02', 'No cart available for the shopping_cart_id', 'cart_id');
        }
        Model.sequelize.query(`CALL shopping_cart_get_saved_products('${cart_id}');`)
          .then(savedCart => res.json(savedCart));
      });
  }

  /**
   * @description - remove item from cart
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShoppingCartController
   *
   * @returns {Promise<object>}
   */
  static removeProduct(req, res) {
    const { item_id } = req.params;

    ShoppingCart.findOne({ where: { itemId: item_id } })
      .then((item) => {
        if (!item) {
          return errorResponse(res, 404, 'ITM_02', 'No item found', 'item_id');
        }
        Model.sequelize.query(`CALL shopping_cart_remove_product(${item_id});`)
          .then(() => res.status(204).json());
      });
  }
}
