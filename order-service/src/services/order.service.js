import prisma from '../config/db.js';
import axios from 'axios';
import CircuitBreaker from 'opossum';

// Función que realiza la validación batch contra el catálogo
const validateStock = async (items) => {
  const payload = { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) };
  const url = `${process.env.CATALOG_SERVICE_URL}/validate`;
  const response = await axios.post(url, payload);
  return response.data;
};

// Instancia del Circuit Breaker envolviendo la función de validación
const stockBreaker = new CircuitBreaker(validateStock, {
  timeout: 3000,                // 3 segundos máximo por petición
  errorThresholdPercentage: 50, // Si falla el 50%, abre el circuito
  resetTimeout: 10000,          // Espera 10s antes de probar de nuevo (half-open)
});

export const createOrder = async (userId, items) => {
  let totalAmount = 0;

  // 1. Validar Stock y Precios con Circuit Breaker
  try {
    const result = await stockBreaker.fire(items);

    // El catálogo devuelve { valid, totalPrice, processedItems }
    totalAmount = result.totalPrice;

  } catch (error) {
    // Caso A: El circuito está ABIERTO (Opossum bloqueó la petición)
    if (error.message && error.message.includes('Breaker is open')) {
      throw new Error('⛔ Corte de seguridad activo (Circuit Open). El sistema no acepta peticiones temporalmente.');
    }

    // Caso B: Timeout o error de red (circuito cerrado pero la petición falló)
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ETIME') {
      throw new Error('⚠️ El servicio de Catálogo no responde (Timeout).');
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