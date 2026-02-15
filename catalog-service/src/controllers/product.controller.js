// src/controllers/productController.js
import Product from '../models/product.model.js';

// @desc    Obtener todos los productos
// @route   GET /products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un producto
// @route   POST /products
export const createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      stock
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    // Si el ID tiene un formato incorrecto (no es ObjectId de Mongo), devolvemos 404 también
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(500).json({ message: error.message });
  }
};