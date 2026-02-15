// src/services/product.service.js
import Product from '../models/product.model.js';

export const getAllProducts = async () => {
  return await Product.find();
};

export const createProduct = async (data) => {
  const { name, description, price, stock } = data;
  const product = new Product({ name, description, price, stock });
  return await product.save();
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  return product;
};

/**
 * Validación de stock masiva (Consistencia).
 * @param {Array<{ productId: string, quantity: number }>} items
 * @returns {{ valid: true, totalPrice: number, processedItems: Array }}
 */
export const validateStockBatch = async (items) => {
  const processedItems = [];
  let totalPrice = 0;

  // Primera iteración: validar existencia y stock suficiente
  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Producto con ID ${item.productId} no encontrado`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`
      );
    }

    processedItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    });

    totalPrice += product.price * item.quantity;
  }

  // Segunda iteración: actualizar stock en la DB
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  return { valid: true, totalPrice, processedItems };
};
