import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    status: 'success',
    message: 'Welcome to Turing eCommerce'
  });
});

router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default router;
