import express from 'express';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
import { createMessage, getMessages } from '../controllers/messageController.js';
const router = express.Router();


router.post("/", verificarJWT, createMessage)
router.get("/:id", verificarJWT, getMessages)

export default router;