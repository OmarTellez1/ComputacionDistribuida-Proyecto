import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado. Token faltante o inválido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // IMPORTANTE: Asegúrate de tener JWT_SECRET en tu .env de este servicio también
    // o usa una clave quemada SOLO para pruebas locales si se te complica.
    // Lo ideal es: process.env.JWT_SECRET (la misma string que en Auth Service)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_123');
    
    // Adjuntamos el usuario decodificado a la request para que el controlador lo use
    req.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};