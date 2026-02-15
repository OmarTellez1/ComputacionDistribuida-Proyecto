import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import productRoutes from './src/routes/product.routes.js';

// Configuración
dotenv.config();
connectDB();

const app = express();


app.use(express.json()); 

app.use(morgan('dev'));

// Rutas
app.use('/', productRoutes);

// Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servicio de Catálogo corriendo en puerto ${PORT}`);
});