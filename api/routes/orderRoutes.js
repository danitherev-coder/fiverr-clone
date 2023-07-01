import express from 'express';
import { verificarJWT } from '../middlewares/verificar-jwt.js';
// import { createOrder, getOrders, intent } from '../controllers/ordersController.js';
import { getOrders, intent, confirm } from '../controllers/ordersController.js';
import Stripe from 'stripe'
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import dotenv from 'dotenv'
dotenv.config()
// router.post("/:gigId", verificarJWT, createOrder)
router.get("/", verificarJWT, getOrders)
router.post("/create-payment-intent/:id", verificarJWT, intent)
router.put("/", verificarJWT, confirm)

router.get("/payment/:id", async (req, res) => {
    const paymentIntentId = req.params.id;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log(paymentIntent, 'este es el payment');

        const product = paymentIntent.status; // Descripción del producto

        console.log('Producto comprado:', product);
        // Aquí puedes realizar las acciones necesarias con la información del producto

        res.status(200).json({ product }); // Opcionalmente, puedes devolver el producto como respuesta JSON
    } catch (error) {
        console.error('Error al recuperar el payment_intent:', error);
        res.status(500).json({ error: 'Error al recuperar el payment_intent' });
        // Manejo de errores y envío de respuesta de error apropiada
    }
})

export default router;