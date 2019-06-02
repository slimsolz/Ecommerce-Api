import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';

const { Attribute, Product } = Model;

require('dotenv').config();

export default class CategoryController {
  /**
   * @description - Get all attributes
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof AttributeController
   *
   * @returns {Promise<object>}
   */
  static getAllAttributes(req, res) {
    Model.sequelize.query('CALL catalog_get_attributes();')
      .then(attributesList => res.json(attributesList));
  }

  /**
   * @description - Get an attribute
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof AttributeController
   *
   * @returns {Promise<object>}
   */
  static getOneAttribute(req, res) {
    const { attribute_id } = req.params;
    Attribute.findOne({ where: { attributeId: attribute_id } })
      .then((attribute) => {
        if (!attribute) {
          return errorResponse(res, 404, 'ATT_01', 'Don\'t exist attribute with this ID', 'attribute_id');
        }

        return res.json(attribute);
      });
  }

  /**
   * @description - Get attribute values
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof AttributeController
   *
   * @returns {Promise<object>}
   */
  static getAttributeValues(req, res) {
    const { attribute_id } = req.params;
    Attribute.findOne({ where: { attributeId: attribute_id } })
      .then((attribute) => {
        if (!attribute) {
          return errorResponse(res, 404, 'ATT_01', 'Don\'t exist attribute with this ID', 'attribute_id');
        }

        Model.sequelize.query(`CALL catalog_get_attribute_values(${attribute_id});`)
          .then(attributeValues => res.json(attributeValues));
      });
  }

  /**
   * @description - Get attribute inProduct
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof AttributeController
   *
   * @returns {Promise<object>}
   */
  static getAttributeInProduct(req, res) {
    const { product_id } = req.params;
    Product.findOne({ where: { productId: product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_02', 'Product not found', 'product_id');
        }

        Model.sequelize.query(`CALL catalog_get_product_attributes(${product_id});`)
          .then(attributes => res.json(attributes));
      });
  }
}
