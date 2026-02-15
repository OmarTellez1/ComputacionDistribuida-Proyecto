import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(morgan('dev'));


// Solo el Gateway define quién entra.
app.use(cors({
  origin: 'http://localhost:5173', // Frontend
  credentials: true,               // Permitir cookies/tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 1. Proxy para Auth
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
}));

// 2. Proxy para Productos
app.use('/products', createProxyMiddleware({
  target: process.env.CATALOG_SERVICE_URL,
  changeOrigin: true,
}));

// 3. Proxy para Órdenes
app.use('/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
}));

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚪 API Gateway corriendo en puerto ${PORT}`);
});