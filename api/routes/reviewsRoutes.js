import express from 'express';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
import { createReview, getReviewBy, updateReview } from '../controllers/reviewConstroller.js';
const router = express.Router();




router.get('/:gigId', getReviewBy)
router.post('/', verificarJWT, createReview)
router.put('/:id', verificarJWT, updateReview);




export default router;