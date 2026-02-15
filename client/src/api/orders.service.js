import axios from './axios';

export const createOrder = async (items) => {
  // Transformar items del carrito al formato que espera el backend
  const orderItems = items.map(item => ({
    productId: item._id || item.id, // Usar _id si existe, sino id
    quantity: item.quantity,
  }));

  const response = await axios.post('/orders', { items: orderItems });
  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`/orders/${id}`, { status });
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await axios.delete(`/orders/${id}`);
  return response.data;
};
