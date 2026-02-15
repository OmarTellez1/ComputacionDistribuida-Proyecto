import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función auxiliar privada
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const registerUser = async ({ name, email, password }) => {
  // 1. Validar existencia
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('El usuario ya existe');
  }

  // 2. Encriptar
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Crear
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  };
};

export const loginUser = async ({ email, password }) => {
  // 1. Buscar usuario
  const user = await User.findOne({ email });

  // 2. Validar password
  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    };
  } else {
    throw new Error('Credenciales inválidas');
  }
};