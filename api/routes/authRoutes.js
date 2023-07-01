import express from 'express';
import { register, login, logout, olvidePassword, verificarToken, restablecerPassword, confirmarEmail, googleSignIn } from '../controllers/authController.js';

const router = express.Router();





router.post('/register', register)
router.get('/confirmar-email/:token', confirmarEmail)

router.post('/login', login)
router.post('/logout', logout)

router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', verificarToken)
router.post('/restablecer-password/:token', restablecerPassword)


router.post('/google', googleSignIn)

export default router;