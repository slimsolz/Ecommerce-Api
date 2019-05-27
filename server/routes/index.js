import express from 'express';
import CustomerController from '../controllers/CustomerController';
import ProductController from '../controllers/ProductController';
import { isLoggedIn } from '../middlewares/authenticate';
import {
  validateRegister, validateLogin, validateReviews,
  validateUpdateCustomer, validateUpdateAddress, validateUpdateCreditCard
} from '../middlewares/validation';
import { validateParams, validateCategoryParams, validateDepartmentParams } from '../middlewares/paramsValidation';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Turing eCommerce'
  });
});

router.post('/customers', validateRegister, CustomerController.register);
router.post('/customers/login', validateLogin, CustomerController.login);
router.get('/customers', isLoggedIn, CustomerController.getCustomer);
router.put('/customers', isLoggedIn, validateUpdateCustomer, CustomerController.updateCustomer);
router.put('/customers/address', isLoggedIn, validateUpdateAddress, CustomerController.updateCustomerAddress);
router.put('/customers/creditCard', isLoggedIn, validateUpdateCreditCard, CustomerController.updateCustomerCreditCard);

router.get('/products/search', ProductController.searchForProduct);
router.get('/products', ProductController.getAllProducts);
router.get('/products/:product_id', validateParams, ProductController.getOneProduct);
router.get('/products/:product_id/details', validateParams, ProductController.getProductDetails);
router.get('/products/:product_id/locations', validateParams, ProductController.getProductLocation);
router.get('/products/:product_id/reviews', validateParams, ProductController.getProductReviews);
router.post('/products/:product_id/reviews', isLoggedIn, validateParams, validateReviews, ProductController.addProductReview);
router.get('/products/inCategory/:category_id', validateCategoryParams, ProductController.getProductInCategory);
router.get('/products/inDepartment/:department_id', validateDepartmentParams, ProductController.getProductInDepartment);

router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default router;
