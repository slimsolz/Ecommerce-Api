import express from 'express';
import CustomerController from '../controllers/CustomerController';
import ProductController from '../controllers/ProductController';
import DepartmentController from '../controllers/DepartmentController';
import CategoryController from '../controllers/CategoryController';
import AttributeController from '../controllers/AttributeController';
import TaxController from '../controllers/TaxController';
import { isLoggedIn } from '../middlewares/authenticate';
import {
  validateRegister, validateLogin, validateReviews,
  validateUpdateCustomer, validateUpdateAddress, validateUpdateCreditCard
} from '../middlewares/validation';
import {
  validateParams, validateCategoryParams,
  validateDepartmentParams, validateAttributeParams, validateTaxParams
} from '../middlewares/paramsValidation';

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

router.get('/departments', DepartmentController.getAllDepartments);
router.get('/departments/:department_id', validateDepartmentParams, DepartmentController.getOneDepartment);

router.get('/categories', CategoryController.getAllCategories);
router.get('/categories/:category_id', validateCategoryParams, CategoryController.getOneCategory);
router.get('/categories/inProduct/:product_id', validateParams, CategoryController.getOneCategoryInProduct);
router.get('/categories/inDepartment/:department_id', validateDepartmentParams, CategoryController.getOneCategoryInDepartment);

router.get('/attributes', AttributeController.getAllAttributes);
router.get('/attributes/:attribute_id', validateAttributeParams, AttributeController.getOneAttribute);
router.get('/attributes/values/:attribute_id', validateAttributeParams, AttributeController.getAttributeValues);
router.get('/attributes/inProduct/:product_id', validateParams, AttributeController.getAttributeInProduct);

router.get('/taxes', TaxController.getAllTaxes);
router.get('/taxes/:tax_id', validateTaxParams, TaxController.getOneTax);

router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default router;
