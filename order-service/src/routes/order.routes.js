import express from 'express';
import { create, getOne, getAll } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/', verifyToken, getAll);

// POST /orders -> Crear orden
router.post('/',verifyToken, create);

// GET /orders/:id -> Ver detalle
router.get('/:id',verifyToken, getOne);

export default router;