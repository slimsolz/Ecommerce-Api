import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';

const { Tax } = Model;

require('dotenv').config();

export default class TaxController {
  /**
   * @description - Get all taxes
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof TaxController
   *
   * @returns {Promise<object>}
   */
  static getAllTaxes(req, res) {
    Tax.findAll()
      .then(taxes => res.json(taxes));
  }


  /**
   * @description - Get an attribute
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof TaxController
   *
   * @returns {Promise<object>}
   */
  static getOneTax(req, res) {
    const { tax_id } = req.params;
    Tax.findOne({ where: { taxId: tax_id }})
      .then(tax => {
        if(!tax) {
          return errorResponse(res, 404, 'TAX_01', 'Don\'t exist tax with this ID', 'tax_id');
        }

        return res.json(tax);
      });
  }
}