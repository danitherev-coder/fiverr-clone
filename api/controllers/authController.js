import { request, response } from 'express';
import UserModel from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';
import { generateAuthToken } from '../helpers/generarJWT.js';
import { emailOlvidePassword, enviarEmail } from '../helpers/emails.js';
import { v4 as uuidv4 } from 'uuid'
import googleVerify from '../helpers/googleVerify.js';

export const register = async (req = request, res = response) => {
    try {

        const { username, email, password, img, country, phone, desc, isSeller } = req.body

        if (!username || !password || !country) {
            res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            // throw new Error('Todos los campos son obligatorios.')
        }

        const buscarUsername = await UserModel.findOne({ username })
        if (buscarUsername) {
            return res.status(400).json({ error: 'El nombre de usuario ya existe.' })
        }

        const buscarEmail = await UserModel.findOne({ email })
        if (buscarEmail) {
            return res.status(400).json({ error: 'El correo electrónico ya existe.' })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.json({ error: 'El correo electrónico no es válido.' });
            // throw new Error('El correo electrónico es válido.')
        }

        const salt = bcryptjs.genSaltSync();
        const passwordHash = bcryptjs.hashSync(password, salt);


        const newUser = new UserModel({
            username,
            email,
            password: passwordHash,
            img,
            country,
            phone,
            desc,
            isSeller,
            token: uuidv4()
        })



        await newUser.save()

        enviarEmail({
            username: newUser?.username,
            email: newUser?.email,
            token: newUser?.token
        })

        return res.status(201).json('Has been created') // 201: Created
        // return res.status(201).json(newUser) // 201: Created


    } catch (error) {

        return res.status(500).json(error);

    }
}
export const login = async (req = request, res = response) => {
    try {
        const { username } = req.body;


        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isPasswordValid = bcryptjs.compareSync(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!user.confirmado) {
            return res.status(401).json({ error: 'Confirma tu email para poder iniciar sesión' });
        }

        const token = await generateAuthToken(user._id, user.isSeller);



        // // crear un refresToken
        // const refreshToken = jwt.sign({ id: user._id, isSeller: user.isSeller }, process.env.REFRESH_TOKEN_SECRET, {
        //     expiresIn: '7d'
        // })
        // // guardar el refreshToken con el usuario actual
        // user.refreshToken = refreshToken;
        // const result = await user.save();
        // console.log(result);
        // // enviar cookie con el refreshToken
        // res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })




        // Configura la expiración de la cookie (por ejemplo, 7 días desde ahora)
        // const expires = new Date();
        // expires.setDate(expires.getDate() + 3);
        res.cookie("accessToken", token, {
            // ESTO ES LO QUE NECESITO PARA QUE FUNCIONE LAS COOKIES EN EL CLIENTE
            httpOnly: true,
            // sameSite: "none",
            // secure: true,
            credentials: true,
            maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        })

        res.json({
            user,
            token
        })

    } catch (error) {

        return res.status(500).json(error);
    }
};

export const logout = async (req = request, res = response) => {
    res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
    }).status(200).json({ message: 'Cierre de sesión exitoso' });
}

export const confirmarEmail = async (req = request, res = response) => {
    try {
        const { token } = req.params
        const usuario = await UserModel.findOne({ token })
        if (!usuario) {
            throw new Error('El token no es válido')
        }

        usuario.token = null
        usuario.confirmado = true
        await usuario.save()

        // res.redirect('/correo-confirmado')
        return res.json('Email fue confirmado')

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const olvidePassword = async (req = request, res = response) => {
    try {
        const { email } = req.body
        const usuario = await UserModel.findOne({ email })
        if (!usuario) {
            return res.status(400).json({
                message: "El email no pertenece a ningun usuario"
            })
            // throw new Error('El email no pertenece a ningun usuario')
        }

        if (!usuario.confirmado) {
            return res.status(400).json({
                message: 'Confirma tu Email para poder restablecer el password'
            })
        }

        usuario.token = uuidv4()
        await usuario.save()

        emailOlvidePassword({
            username: usuario.username,
            email: usuario.email,
            token: usuario.token
        })

        return res.json({
            message: 'Se acaba de enviar un email, por favor sigue los pasos'
        })

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const verificarToken = async (req = request, res = response) => {
    try {
        const { token } = req.params
        const usuario = await UserModel.findOne({ token })
        if (!usuario) {
            return res.status(400).json({
                message: 'El token no es valido'
            })
        }

        return res.json({
            message: 'El token se verifico con exito, ahora puede restablecer su password'
        })

    } catch (error) {
        return res.status(500).json(error);
    }
}

export const restablecerPassword = async (req = request, res = response) => {
    try {
        const { token } = req.params
        const { password } = req.body
        const usuario = await UserModel.findOne({ token })

        if (password === '') {
            return res.status(400).json({
                message: 'El password no debe estar vacio'
            })
        }

        const salt = bcryptjs.genSaltSync()
        usuario.password = bcryptjs.hashSync(password, salt)
        usuario.token = null
        await usuario.save()

        return res.json({
            message: 'Su password se cambio correctamente, ahora puede iniciar sesion'
        })

    } catch (error) {
        return res.status(500).json(error);
    }
}


export const googleSignIn = async (req = request, res = response) => {

    try {
        const { id_token } = req.body;

        const { email, username, img } = await googleVerify(id_token);


        let user = await UserModel.findOne({ email });

        if (!user) {
            // Tengo que crearlo
            const data = {
                username,
                email,
                password: ':P',
                img,
                google: true,
                confirmado: true,
                token: null
            };

            user = new UserModel(data);
            await user.save();
        }

        // Si el user en DB
        // if (!user.estado) {
        //     return res.status(401).json({
        //         msg: 'Hable con el administrador, user bloqueado'
        //     });
        // }

        // Generar el JWT
        const token = await generateAuthToken(user.id);
        // crear cookie
        res.cookie('accessToken', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Token de Google no es válido',
            error
        })

    }
}