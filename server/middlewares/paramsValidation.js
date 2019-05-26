import isInt from 'validator/lib/isInt';
import { errorResponse } from "../helpers/responseHelper";

export const validateParams = (req, res, next) => {
  const reqId = req.params.product_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'PRD_1' , 'The product_id is not a number', 'product_id');
  }
  return next();
};

export const validateCategoryParams = (req, res, next) => {
  const reqId = req.params.category_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'CAT_1' , 'The category_id is not a number', 'category_id');
  }
  return next();
};

export const validateDepartmentParams = (req, res, next) => {
  const reqId = req.params.department_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'DPT_1' , 'The department_id is not a number', 'department_id');
  }
  return next();
};