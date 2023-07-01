import { request, response } from 'express';
import UserModel from '../models/UserModel.js';
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: 'dpyr2wyaf',
    api_key: '846634682136411',
    api_secret: 'q3mJGEPShDL5r92iI5C_hCoEh6I',
    // secure: true
})

export const deleteUser = async (req = request, res = response) => {
    try {


        const user = await UserModel.findById(req.params.id)
        if (req.userId !== user._id.toString()) {
            return res.status(403).json({ error: "you can delete only your account" })
        }

        await UserModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "Account has been deleted" })

    } catch (error) {

        return res.status(500).json(error);
    }
}

export const getUser = async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    res.status(200).send(user);
};

export const getUsers = async (req, res, next) => {
    const users = await UserModel.find();

    res.status(200).send(users);
}


export const userWishlist = async (req, res) => {
    const userId = req.userId

    console.log(userId, 'existe user id');
    try {
        const { wishList } = await UserModel.findById(userId).populate('wishList')
        if (!wishList) {
            return res.status(404).json({ error: 'Aun no agrego ningun Gig a su lista de deseos' })
        }
        return res.json(wishList)
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteFromCloudinary = async (publicId) => {
    console.log(publicId, 'que estoy pasando?');
    try {
        const result = await cloudinary.v2.uploader.destroy(publicId)
        console.log('Imagen eliminada de Cloudinary:', result);
    } catch (error) {
        console.error('Error al eliminar la imagen de Cloudinary:', error);
        throw new Error('Error al eliminar la imagen de Cloudinary');
    }
};
export const editarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar que exista el usuario
        const usuario = await UserModel.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Verificar que el usuario que quiere editar sea el mismo que está logueado
        if (req.userId !== usuario._id.toString()) {
            return res.status(403).json({ error: "Solo puedes editar tu propia cuenta" });
        }

        // Verificar si el username no está registrado
        if (req.body.username) {
            const existeUsername = await UserModel.findOne({ username: req.body.username });
            if (existeUsername && existeUsername._id.toString() !== id) {
                return res.status(400).json({ error: 'El username ya está registrado' });
            }
        }

        // Verificar si se envió un nuevo email y realizar la validación correspondiente
        if (req.body.email) {
            // Verificar si el nuevo email coincide con el email existente
            if (req.body.email !== usuario.email) {
                const existeEmail = await UserModel.findOne({ email: req.body.email });
                if (existeEmail && existeEmail._id.toString() !== id) {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
            }
        }

        // Obtener los campos a actualizar del cuerpo de la solicitud
        const { password, img, ...resto } = req.body;

        // Verificar si se envió una nueva contraseña y hashearla
        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        // Verificar si se envió una nueva imagen de perfil
        if (req.body.img !== undefined && req.body.img !== null) {
            // Eliminar la imagen anterior de Cloudinary si es necesario
            const imageId = usuario.img;
            if (req.body.img !== imageId) {
                await deleteFromCloudinary(imageId);
            }

            usuario.img = req.body.img;
        }



        console.log(req.body.img, 'que me envian la ptmre');

        // Combinar los campos a actualizar con los datos existentes del usuario
        const updatedUser = { ...usuario._doc, ...resto };

        // Actualizar el usuario en la base de datos
        const updateUser = await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });
        return res.status(200).json(updateUser);
    } catch (error) {
        return res.status(500).json(error);
    }
};

