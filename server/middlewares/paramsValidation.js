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

export const validateAttributeParams = (req, res, next) => {
  const reqId = req.params.attribute_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'ATT_02' , 'The attribute_id is not a number', 'attribute_id');
  }
  return next();
};

export const validateTaxParams = (req, res, next) => {
  const reqId = req.params.tax_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'TAX_02' , 'The tax_id is not a number', 'tax_id');
  }
  return next();
};

export const validateShippingRegionParams = (req, res, next) => {
  const reqId = req.params.shipping_region_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'SHP_02' , 'The shipping_region_id is not a number', 'shipping_region_id');
  }
  return next();
};

export const validateOrderParams = (req, res, next) => {
  const reqId = req.params.order_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'ORD_01' , 'The order_id is not a number', 'order_id');
  }
  return next();
};

export const validateItemParams = (req, res, next) => {
  const reqId = req.params.item_id;
  const id = isInt(reqId);

  if (!id) {
    return errorResponse(res, 400, 'ITM_01' , 'The item_id is not a number', 'item_id');
  }
  return next();
};
