import { Op } from 'sequelize';
import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';
import { description } from '../helpers/displayDescription';

const { Product, Category, Department } = Model;

require('dotenv').config();

export default class ProductController {
  /**
   * @description - Get all products
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static getAllProducts(req, res) {
    const { page = 1, limit = 20, description_length = 200 } = req.query;
    Product.findAndCountAll({
      attributes: ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'],
      limit: parseInt(limit),
      offset: (parseInt(limit) * ((parseInt(page) - 1))) || 0
    })
      .then((products) => {
        products.rows.map((product) => {
          product.description = description(product.description, description_length);
        });
        return res.status(206).json(products);
      });
  }

  /**
   * @description - Get product by id
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static getOneProduct(req, res) {
    const { product_id } = req.params;
    Product.findOne({ where: { product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_2', 'Product not found', 'product_id');
        }

        return res.json(product);
      });
  }

  /**
   * @description - Get product details
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static getProductDetails(req, res) {
    const { product_id } = req.params;
    Product.findOne({ where: { product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_2', 'Product not found', 'product_id');
        }

        return res.json(product);
      });
  }

  /**
   * @description - Get product location
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static getProductLocation(req, res) {
    const { product_id } = req.params;
    Product.findOne({ where: { product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_2', 'Product not found', 'product_id');
        }
        Model.sequelize.query(`CALL catalog_get_product_locations(${product_id});`)
          .then(result => res.json(result));
      });
  }

  /**
   * @description - Get product reviews
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static getProductReviews(req, res) {
    const { product_id } = req.params;
    Product.findOne({ where: { product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_2', 'Product not found', 'product_id');
        }
        Model.sequelize.query(`CALL catalog_get_product_reviews(${product_id});`)
          .then((result) => {
            if (result.length === 0) {
              return res.status(200).json({
                message: 'No review at the moment'
              });
            }
            return res.json(result);
          });
      });
  }

  /**
   * @description - add product review
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static addProductReview(req, res) {
    const { product_id } = req.params;
    const { customerId } = req;
    const { review, rating } = req.body;

    Product.findOne({ where: { product_id } })
      .then((product) => {
        if (!product) {
          return errorResponse(res, 404, 'PRD_2', 'Product not found', 'product_id');
        }
        Model.sequelize.query(
          `CALL catalog_create_product_review(${customerId}, ${product_id}, '${review}', ${rating});`
        ).then(() => res.status(200).json());
      });
  }

  /**
   * @description - Get product in category
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static getProductInCategory(req, res) {
    const { category_id } = req.params;
    const { page = 1, limit = 20, description_length = 200 } = req.query;
    Category.findOne({ where: { category_id } })
      .then((category) => {
        if (!category) {
          return errorResponse(res, 404, 'CAT_1', 'Don\'t exist category with this ID', 'category_id');
        }

        Model.sequelize.query(`CALL catalog_count_products_in_category(${category_id})`)
          .then((count) => {
            Model.sequelize.query(`CALL catalog_get_products_in_category(${category_id}, ${description_length}, ${limit}, ${page})`)
              .then(products => res.status(206).json({
                count: count[0].categories_count,
                rows: products
              }));
          });
      });
  }

  /**
   * @description - Get product in department
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static getProductInDepartment(req, res) {
    const { department_id } = req.params;
    const { page = 1, limit = 20, description_length = 200 } = req.query;
    Department.findOne({ where: { department_id } })
      .then((department) => {
        if (!department) {
          return errorResponse(res, 404, 'DPT_1', 'Don\'t exist department with this ID', 'department_id');
        }

        Model.sequelize.query(`CALL catalog_count_products_on_department(${department_id})`)
          .then((count) => {
            Model.sequelize.query(`CALL catalog_get_products_on_department(${department_id}, ${description_length}, ${limit}, ${page})`)
              .then(products => res.status(206).json({
                count: count[0].products_on_department_count,
                rows: products
              }));
          });
      });
  }

  /**
   * @description - Get product from search
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof ProductController
   *
   * @returns {Promise<object>}
   */
  static searchForProduct(req, res) {
    const {
      query_string, all_words = 'off', page = 0, limit = 20, description_length = 20
    } = req.query;
    if (!query_string) {
      return errorResponse(res, 400, 'QRY_01', 'The field is required', 'query_string');
    }
    Model.sequelize.query(`CALL catalog_count_search_result('${query_string}', '${all_words}')`)
      .then((count) => {
        if (all_words === 'off') {
          Product.findAndCountAll({
            where: {
              [Op.or]: [
                {
                  name: { [Op.like]: `%${query_string}%` },
                },
                {
                  description: { [Op.like]: `%${query_string}%` }
                }
              ]
            },
            attributes: ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'],
          })
            .then((products) => {
              products.rows.map((product) => {
                product.description = description(product.description, description_length);
              });
              res.status(206).json(products);
            });
        } else {
          Product.findAndCountAll({
            where: {
              [Op.or]: [
                {
                  name: `${query_string}`,
                },
                {
                  description: `${query_string}`
                }
              ]
            },
            attributes: ['product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail'],
          })
            .then((products) => {
              products.rows.map((product) => {
                product.description = description(product.description, description_length);
              });
              res.status(206).json(products);
            });
        }
      });
  }
}
