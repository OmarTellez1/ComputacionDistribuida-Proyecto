import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(morgan('dev'));

// Rutas base
app.use('/', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servicio de Autenticación corriendo en puerto ${PORT}`);
});