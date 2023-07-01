import { request, response } from "express"
import OrderModel from "../models/OrderModel.js"
import GigModel from "../models/GigModel.js"
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()


export const intent = async (req = request, res = response) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        // obtendre el precio del gig a traves del id del gig que esta en el params
        const gig = await GigModel.findById(req.params.id)

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: gig.price * 100, // el precio del gig lo multiplicamos por 100 para que quede en centavos
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });


        const newOrder = new OrderModel({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: req.userId, // sacamos el id del usuario que esta haciendo la compra, o sea inicio sesion
            sellerId: gig.userId, // sacamos el id del usuario que esta vendiendo el gig, del que creo el gig
            price: gig.price,
            payment_intent: paymentIntent.id
        })

        await newOrder.save()

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        })

    } catch (error) {
        return res.status(500).json(error)
    }
}

// esto sirve para multiples productos
// export const createCheckoutSession = async (req, res) => {
//     try {
//         const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//         const { gigItems } = req.body;

//         const lineItems = gigItems.map(item => ({
//             price_data: {
//                 currency: 'usd',
//                 product_data: {
//                     name: item.gig.title,
//                 },
//                 unit_amount: item.gig.price * 100,
//             },
//             quantity: item.quantity,
//         }));

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: lineItems,
//             mode: 'payment',
//             success_url: 'https://example.com/success',
//             cancel_url: 'https://example.com/cancel',
//         });

//         return res.status(200).json({
//             sessionId: session.id,
//             redirectUrl: session.url,
//         });
//     } catch (error) {
//         return res.status(500).json(error);
//     }
// };



//=============================================================================
//        COMENTO ESTO PORQUE ERA DE PRUEBA, AHORA USAMOS STRIPE
//=============================================================================


// export const createOrder = async (req = request, res = response) => {
//     try {
//         sacaremos el precio del gig para asi poder pasarlo a la orden
//         const { gigId } = req.params
//         const gig = await GigModel.findById(gigId)

//         const newOrder = new OrderModel({
//             gigId: gig._id,
//             img: gig.cover,
//             title: gig.title,
//             buyerId: req.userId, // sacamos el id del usuario que esta haciendo la compra, o sea inicio sesion
//             sellerId: gig.userId, // sacamos el id del usuario que esta vendiendo el gig, del que creo el gig
//             price: gig.price,
//             payment_intent: "temporaly"
//         })

//         await newOrder.save()

//         return res.status(201).json({
//             success: "Order created",
//             newOrder
//         })

//     } catch (error) {
//         return res.status(500).json(error)
//     }
// }

// export const getOrders = async (req = request, res = response) => {
//     try {
//         const orders = await OrderModel.find({
//             ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
//             isCompleted: true
//         }).sort({ createdAt: -1 })


//         return res.status(200).json(orders)

//     } catch (error) {

//         return res.status(500).json(error)
//     }
// }
export const getOrders = async (req = request, res = response) => {
    try {
        const orders = await OrderModel.find({
            $or: [
                { sellerId: req.userId }, // Si el usuario es vendedor
                { buyerId: req.userId }, // Si el usuario no es vendedor
            ],
            isCompleted: true
        }).sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json(error);
    }
};


// export const confirm = async (req = request, res = response) => {
//     try {
//         const orders = await OrderModel.findOneAndUpdate(
//             {
//                 payment_intent: req.body.payment_intent
//             },
//             {
//                 $set: {
//                     isCompleted: true
//                 }
//             },
//             { new: true }
//         )



//         return res.status(200).json("Oder has been confirmed")

//     } catch (error) {
//         return res.status(500).json(error)
//     }
// }


// ESte controlador sirve para confirmar la orden de compra del gig, una vez que se confirme, pasa a ser isCompleted: true, ademas en el modelo del Gig que se compro se actualiza el sales, que pasara a ser 1 si se compro, si se compra de nuevo sera 2... asi..
export const confirm = async (req = request, res = response) => {
    try {
        // Actualiza el estado de la orden
        const order = await OrderModel.findOneAndUpdate(
            {
                payment_intent: req.body.payment_intent
            },
            {
                $set: {
                    isCompleted: true
                }
            },
            { new: true }
        );

        // Incrementa el valor de sales en el modelo Gig
        await GigModel.findByIdAndUpdate(order.gigId, {
            $inc: { sales: 1 }
        });

        return res.status(200).json("Order has been confirmed");
    } catch (error) {
        return res.status(500).json(error);
    }
};


