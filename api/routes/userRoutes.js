import express from 'express';
import { deleteUser, editarPerfil, getUser, getUsers, userWishlist } from '../controllers/UserController.js';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
// import { getaUser } from '../controllers/UserController.js';
const router = express.Router();

router.put("/editar-perfil/:id", verificarJWT, editarPerfil)
router.delete('/delete/:id', verificarJWT, deleteUser)
// router.get('/:id', verificarJWT, getUser)
router.get('/wishlist', verificarJWT, userWishlist)
router.get('/', getUsers)
router.get('/:id', getUser)

export default router;