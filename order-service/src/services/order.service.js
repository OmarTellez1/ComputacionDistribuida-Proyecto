import prisma from '../config/db.js';
import axios from 'axios';

export const createOrder = async (userId, items) => {
  let totalAmount = 0;

  // 1. Validar Stock y Precios comunicándose con el servicio de Catálogo
  // Iteramos sobre cada item que el usuario quiere comprar
  for (const item of items) {
    try {
      // LLAMADA SINCRÓNICA: GET http://localhost:3002/products/{id}
      const url = `${process.env.CATALOG_SERVICE_URL}/${item.productId}`;
      const response = await axios.get(url);
      const product = response.data;

      // Validar si hay suficiente stock
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto: ${product.name}`);
      }

      // Sumar al total (Usamos el precio REAL que viene del catálogo, no del frontend)
      totalAmount += product.price * item.quantity;

    } catch (error) {
      // Manejo de errores de comunicación (Circuit Breaker simplificado)
      if (error.response && error.response.status === 404) {
        throw new Error(`El producto ${item.productId} no existe en el catálogo`);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('El servicio de Catálogo no está disponible. Intente más tarde.');
      }
      throw error; // Re-lanzar otros errores (como stock insuficiente)
    }
  }

  // 2. Crear la Orden en PostgreSQL usando Prisma
  const order = await prisma.order.create({
    data: {
      userId,
      items,       // Prisma convierte esto a JSON automáticamente
      totalAmount,
      status: 'PENDING'
    }
  });

  return order;
};

export const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id }
  });
};

export const getAllOrders = async () => {
  // findMany obtiene todos los registros
  return await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc' // Opcional: Las más nuevas primero
    }
  });
};