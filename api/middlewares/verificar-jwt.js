import { request, response } from 'express'
import jwt from 'jsonwebtoken'


export const verificarJWT = async (req = request, res = response, next) => {
    try {
        const token = req.cookies.accessToken


        if (!token) {
            return res.status(401).json({ error: 'No iniciaste sesion' })
        }

        // res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });

        jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
            // if (err) return res.status(403).json({ error: 'Token no valido' })
            if (err) {
                // Eliminar la cookie y limpiar el local storage
                res.clearCookie('accessToken');
                return res.status(403).json({ error: 'Token no válido' });
            }
            req.userId = payload.id
            req.isSeller = payload.isSeller

            next()
        })

    } catch (err) {

        return res.status(500).json(err);
    }
}