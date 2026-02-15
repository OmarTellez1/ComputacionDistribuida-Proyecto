// src/routes/productRoutes.js
import express from 'express';
import { getProducts, createProduct, getProductById, validateBatch } from '../controllers/product.controller.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.post('/validate', validateBatch);

router.route('/:id')
  .get(getProductById);
  
export default router;