import Model from '../models';
import { errorResponse } from '../helpers/responseHelper';

const { Department } = Model;

require('dotenv').config();

export default class DepartmentController {
  /**
   * @description - Get all departments
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof DepartmentController
   *
   * @returns {Promise<object>}
   */
  static getAllDepartments(req, res) {
    Model.sequelize.query('CALL catalog_get_departments();')
      .then(departments => res.json(departments));
  }

  /**
   * @description - Get a departments
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof DepartmentController
   *
   * @returns {Promise<object>}
   */
  static getOneDepartment(req, res) {
    const { department_id } = req.params;
    Department.findOne({ where: { departmentId: department_id } })
      .then((department) => {
        if (!department) {
          return errorResponse(res, 404, 'DEP_02', 'Don\'t exist department with this ID', 'department_id');
        }

        return res.json(department);
      });
  }
}
