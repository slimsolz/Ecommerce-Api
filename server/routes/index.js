import express from 'express';
import CustomerController from '../controllers/CustomerController';
import { isLoggedIn } from '../middlewares/authenticate';
import {
  validateRegister, validateLogin,
  validateUpdateCustomer, validateUpdateAddress, validateUpdateCreditCard
} from '../middlewares/validation';

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

router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default router;
