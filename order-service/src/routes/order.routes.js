import express from 'express';
import { create, getOne, getAll } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/', verifyToken, getAll);


router.post('/',verifyToken, create);


router.get('/:id',verifyToken, getOne);

export default router;