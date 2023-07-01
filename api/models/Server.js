import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors'
import compression from 'compression';
import brotli from 'brotli';

import authRoutes from '../routes/authRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import conversationRoutes from '../routes/conversationRoutes.js';
import gigRoutes from '../routes/gigRoutes.js';
import messageRoutes from '../routes/messageRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import reviewsRoutes from '../routes/reviewsRoutes.js';
import connectDB from '../config/db.js';
import { corsOptionsDelegate } from '../helpers/cors.js';

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 8080
        this.path = {
            auth: '/api/auth',
            user: '/api/user',
            gig: '/api/gigs',
            review: '/api/review',
            conversation: '/api/conversation',
            message: '/api/message',
            order: '/api/order',
        }
        this.dbConect();
        this.middlewares()
        this.routes()
    }

    dbConect() {
        connectDB();
    }


    middlewares() {
        this.app.use(compression({
            level: 6,
            filter: (req, res) => {
                const contentType = res.getHeader('Content-Type');
                if (contentType && contentType.match(/text|javascript|css/)) {
                    return brotli;
                }
                return false;
            }
        }));

        this.app.use(cors(corsOptionsDelegate))
        // this.app.use(cors({ origin: ["http://localhost:5173", "http://192.168.1.37:5173"], credentials: true }))

        this.app.use(express.json())
        this.app.use(cookieParser())
    }

    routes() {
        this.app.use(this.path.auth, authRoutes)
        this.app.use(this.path.user, userRoutes)
        this.app.use(this.path.conversation, conversationRoutes)
        this.app.use(this.path.gig, gigRoutes)
        this.app.use(this.path.message, messageRoutes)
        this.app.use(this.path.order, orderRoutes)
        this.app.use(this.path.review, reviewsRoutes)

    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto:', this.port);
        })
    }
}

export default Server;