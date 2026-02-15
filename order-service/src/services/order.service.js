import prisma from '../config/db.js';
import axios from 'axios';

export const createOrder = async (userId, items) => {
  let totalAmount = 0;

  // 1. Validar Stock y Precios con una única llamada al servicio de Catálogo
  try {
    const payload = { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) };
    const url = `${process.env.CATALOG_SERVICE_URL}/validate`;
    const response = await axios.post(url, payload);

    // El catálogo devuelve { valid, totalPrice, processedItems }
    totalAmount = response.data.totalPrice;

  } catch (error) {
    // Circuit Breaker: error de red / conexión rechazada / timeout
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new Error('El servicio de Catálogo no está disponible. Intente más tarde.');
    }

    // Error controlado del catálogo (409 Conflict / 500)
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al validar stock en el catálogo');
    }

    throw error;
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