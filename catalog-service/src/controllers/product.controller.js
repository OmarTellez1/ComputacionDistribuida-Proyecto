// src/controllers/productController.js
import * as productService from '../services/product.service.js';

// @desc    Obtener todos los productos
// @route   GET /products
export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un producto
// @route   POST /products
export const createProduct = async (req, res) => {
  try {
    const createdProduct = await productService.createProduct(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validar stock masivo
// @route   POST /products/validate
export const validateBatch = async (req, res) => {
  try {
    const { items } = req.body;
    const result = await productService.validateStockBatch(items);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('Stock insuficiente') || error.message.includes('no encontrado')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};