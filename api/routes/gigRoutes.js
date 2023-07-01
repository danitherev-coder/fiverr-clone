import express from 'express';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
import { addToWishlist, createGig, deleteGig, getGig, getGigs, updatedGig } from '../controllers/gigController.js';


const router = express.Router();


router.get('/single/:id', getGig)
router.get('/', getGigs)
router.post('/', verificarJWT, createGig)
router.put('/wishlist', verificarJWT, addToWishlist)
router.put('/:id', verificarJWT, updatedGig)
router.delete('/:id', verificarJWT, deleteGig)
// router.delete('/delete-images', verificarJWT, deleteFromCloudinary)

export default router;