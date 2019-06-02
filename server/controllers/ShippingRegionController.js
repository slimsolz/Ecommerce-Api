import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';

const { ShippingRegion, Shipping } = Model;

require('dotenv').config();

export default class ShippingRegionController {
  /**
   * @description - Get Shipping Region
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShippingRegionController
   *
   * @returns {Promise<object>}
   */
  static getAllShippingRegion(req, res) {
    Model.sequelize.query('CALL customer_get_shipping_regions();')
      .then(regionList => res.json(regionList));
  }


  /**
   * @description - Get a particular Shipping Regions
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ShippingRegionController
   *
   * @returns {Promise<object>}
   */
  static getOneShoppingRegion(req, res) {
    const { shipping_region_id } = req.params;
    ShippingRegion.findOne({ where: { shippingRegionId: shipping_region_id } })
      .then((shippingRegion) => {
        if (!shippingRegion) {
          return errorResponse(res, 404, 'SHR_01', 'Don\'t exist shipping region with this ID', 'shipping_region_id');
        }

        Shipping.findAll({ where: { shippingRegionId: shipping_region_id } })
          .then(shippingList => res.json(shippingList));
      });
  }
}
