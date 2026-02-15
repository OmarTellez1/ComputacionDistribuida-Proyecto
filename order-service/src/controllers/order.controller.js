import * as orderService from '../services/order.service.js';

export const create = async (req, res) => {
  try {
    const { items } = req.body;
    
    // 1. Extraer el ID del usuario del Token (Security Best Practice)
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no identificado en el token' });
    }

    // 2. Llamar al SERVICIO 
    // Le pasamos el userId y los items. El servicio se encarga de validar stock y calcular precios.
    const newOrder = await orderService.createOrder(userId, items);

    res.status(201).json(newOrder);
  } catch (error) {
    // Si el servicio lanza error (ej: "Stock insuficiente"), lo capturamos aquí
    console.error("Error creando orden:", error.message);
    
    // Si es error de stock o validación, devolvemos 400, si es otra cosa 500
    if (error.message.includes('insuficiente') || error.message.includes('no existe')) {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};