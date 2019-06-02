import jwt from 'jsonwebtoken';
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
export const isLoggedIn = (req, res, next) => {
  const token = req.get('USER-KEY');
  if (!token) {
    errorResponse(res, 401, 'AUT_02', 'Access Unauthorized', 'NoAuth');
  }

  jwt.verify(token.slice(7), process.env.SECRET, (err, decoded) => {
    if (err) {
      errorResponse(res, 401, 'AUT_02', 'The apikey is invalid', 'API-KEY');
    }
    req.customerId = decoded.id;
    return next();
  });
};
