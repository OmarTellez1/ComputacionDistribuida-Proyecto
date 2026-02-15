import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // El formato es "Bearer <token>", así que separamos por espacio y tomamos el índice 1
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Añadimos el usuario a la request para usarlo después
      req.user = decoded; 
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};