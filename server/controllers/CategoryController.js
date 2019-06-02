import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';

const { Category, Product, Department } = Model;

require('dotenv').config();

export default class CategoryController {
  /**
   * @description - Get all categories
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CategoryController
   *
   * @returns {Promise<object>}
   */
  static getAllCategories(req, res) {
    Model.sequelize.query('CALL catalog_get_categories();')
      .then(categories => res.json(categories));
  }

  /**
   * @description - Get one category
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CategoryController
   *
   * @returns {Promise<object>}
   */
  static getOneCategory(req, res) {
    const { category_id } = req.params;
    Category.findOne({ where: { categoryId: category_id } })
      .then((category) => {
        if (!category) {
          return errorResponse(res, 404, 'CAT_01', 'Don\'t exist category with this ID', 'category_id');
        }

        return res.json(category);
      });
  }

  /**
   * @description - Get one category inProduct
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CategoryController
   *
   * @returns {Promise<object>}
   */
  static getOneCategoryInProduct(req, res) {
    const { product_id } = req.params;
    Product.findOne({ where: { productId: product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_02', 'Product not found', 'product_id');
        }

        Model.sequelize.query(`CALL catalog_get_categories_for_product(${product_id});`)
          .then(category => res.json(category));
      });
  }

  /**
   * @description - Get one category inDepartment
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof CategoryController
   *
   * @returns {Promise<object>}
   */
  static getOneCategoryInDepartment(req, res) {
    const { department_id } = req.params;
    Department.findOne({ where: { departmentId: department_id } })
      .then((department) => {
        if (!department) {
          return errorResponse(res, 404, 'DEP_02', 'Don\'t exist department with this ID', 'department_id');
        }

        Model.sequelize.query(`CALL catalog_get_department_categories(${department_id});`)
          .then((category) => {
            category.map(categoryDepartment => categoryDepartment.department_id = department_id);
            return res.json(category);
          });
      });
  }
}
