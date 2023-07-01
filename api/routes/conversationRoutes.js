import express from 'express';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
import { createConversation, getConversations, getSingleConversation, updateConversation } from '../controllers/conversationController.js';
const router = express.Router();



router.get("/", verificarJWT, getConversations)
router.get("/single/:id", verificarJWT, getSingleConversation)
router.post("/", verificarJWT, createConversation)
router.put("/:id", verificarJWT, updateConversation)
export default router;