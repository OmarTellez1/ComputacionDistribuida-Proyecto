import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import orderRoutes from './src/routes/order.routes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();

// --- Middlewares Globales ---
app.use(express.json()); 
app.use(morgan('dev'));  

// --- Rutas ---

app.use('/', orderRoutes);

// --- Manejo de errores 404 (Ruta no encontrada) ---
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado en Order Service' });
});

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 Order Service (Prisma) corriendo en puerto ${PORT}`);
});