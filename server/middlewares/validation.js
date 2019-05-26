import validator from 'validator';
import isInt from 'validator/lib/isInt';
import { errorResponse } from '../helpers/responseHelper';

/**
 * @description - check if a customer is logged in
 *
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {object} next
 *
 * @returns
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  let statusCode = 400;

  if (!email) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'email');
  } else if(email && !validator.isEmail(email)) {
    errorResponse(res, statusCode, 'USR_03', 'The email is invalid', 'email');
  } else if (!name) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'name');
  } else if(typeof(name) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The name is invalid', 'name');
  } else if (!password || (password && validator.isEmpty(password.trim()))) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'password');
  } else if (password.length < 8) {
    errorResponse(res, statusCode, 'USR_03', 'password must be at least 8 characters long', 'password');
  } else {
    return next();
  }
}

/**
 * @description - check if a customer is logged in
 *
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {object} next
 *
 * @returns
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  let statusCode = 400;

  if (!email) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'email');
  } else if(email && !validator.isEmail(email)) {
    errorResponse(res, statusCode, 'USR_03', 'The email is invalid', 'email');
  } else if (!password || (password && validator.isEmpty(password.trim()))) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'password');
  } else if (password && password.length < 8) {
    errorResponse(res, statusCode, 'USR_03', 'password must be at least 8 characters long', 'password');
  } else {
    return next();
  }
}

/**
 * @description - validate customer update
 *
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {object} next
 *
 * @returns
 */
export const validateUpdateCustomer = (req, res, next) => {
  const {
    name, email, password, day_phone, eve_phone, mob_phone
  } = req.body;
  let statusCode = 400;

  if (!email) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'email');
  } else if(email && !validator.isEmail(email)) {
    errorResponse(res, statusCode, 'USR_03', 'The email is invalid', 'email');
  } else if (!name) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'name');
  } else if(typeof(name) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The name is invalid', 'name');
  } else if (password && password.length < 8) {
    errorResponse(res, statusCode, 'USR_03', 'password must be at least 8 characters long', 'password');
  } else if (day_phone && typeof(day_phone) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'day phone is invalid', 'day_phone');
  } else if (eve_phone && typeof(eve_phone) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'eve phone is invalid', 'eve_phone');
  } else if (mob_phone && typeof(mob_phone) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'mob phone is invalid', 'mob_phone');
  } else {
    return next();
  }
}

/**
 * @description - validate customer address info
 *
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {object} next
 *
 * @returns
 */
export const validateUpdateAddress = (req, res, next) => {
  const {
    address_1, address_2, city, region, postal_code, country, shipping_region_id
  } = req.body;
  let statusCode = 400;

  if (!address_1) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'address_1');
  } else if(address_1 && typeof(address_1) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The address_1 is invalid', 'address_1');
  } else if(address_2 && typeof(address_2) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The address_2 is invalid', 'address_2');
  } else if (!city) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'city');
  } else if(city && typeof(city) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The city is invalid', 'city');
  } else if (!region) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'region');
  } else if(region && typeof(region) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The region is invalid', 'region');
  } else if (!postal_code) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'postal_code');
  } else if(postal_code && typeof(postal_code) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The postal_code is invalid', 'postal_code');
  } else if (!country) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'country');
  } else if(country && typeof(country) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The country is invalid', 'country');
  } else if (!shipping_region_id) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'shipping_region_id');
  } else if(shipping_region_id && typeof(shipping_region_id) !== 'number') {
    errorResponse(res, statusCode, 'USR_03', 'The shipping_region_id is invalid', 'shipping_region_id');
  }else {
    return next();
  }
}

/**
 * @description - validate customer address info
 *
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {object} next
 *
 * @returns
 */
export const validateUpdateCreditCard = (req, res, next) => {
  const {
    credit_card
  } = req.body;
  let statusCode = 400;

  if (!credit_card) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'credit_card');
  } else if(credit_card && typeof(credit_card) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The credit_card is invalid', 'credit_card');
  }else {
    return next();
  }
}

export const validateReviews = (req, res, next) => {
  const {
    review, rating
  } = req.body;
  let statusCode = 400;

  if (!review) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'review');
  } else if(review && typeof(review) !== 'string') {
    errorResponse(res, statusCode, 'USR_03', 'The review is invalid', 'review');
  } if (!rating) {
    errorResponse(res, statusCode, 'USR_02', 'The field is required', 'rating');
  } else if(rating && typeof(rating) !== 'number') {
    errorResponse(res, statusCode, 'USR_03', 'The rating is invalid', 'rating');
  } else {
    return next();
  }
}
