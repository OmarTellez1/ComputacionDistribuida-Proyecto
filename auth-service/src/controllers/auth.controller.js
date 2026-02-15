import * as authService from '../services/auth.service.js';
import User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const userData = await authService.registerUser(req.body);
    res.status(201).json(userData);
  } catch (error) {
    // Manejo simple de errores basado en el mensaje
    const status = error.message === 'El usuario ya existe' ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const userData = await authService.loginUser(req.body);
    res.json(userData);
  } catch (error) {
    const status = error.message === 'Credenciales inválidas' ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    // Buscamos todos y excluimos el campo password por seguridad
    const users = await User.find().select('-password');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};