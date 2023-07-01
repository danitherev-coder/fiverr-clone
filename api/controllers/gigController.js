import { request, response } from 'express'
import GigModel from '../models/GigModel.js'
import UserModel from '../models/UserModel.js'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: 'dpyr2wyaf',
    api_key: '846634682136411',
    api_secret: 'q3mJGEPShDL5r92iI5C_hCoEh6I',
    // secure: true
})

export const createGig = async (req = request, res = response) => {
    // este validacion viene de verificar-jwt.js para ver si es vendedor(isSeller)
    if (!req.isSeller) {
        return res.status(403).json({ error: 'Solo vendedores pueden crear un GIG(producto)' })
    }

    const newGig = new GigModel({
        userId: req.userId,
        ...req.body
    })
    try {

        const saveGig = await newGig.save()

        return res.status(201).json(saveGig)

    } catch (error) {
        return res.status(400).json(error)
    }

}

export const updatedGig = async (req = request, res = response) => {
    try {
        const { id } = req.params
        const gig = await GigModel.findById(id)
        if (!gig) {
            return res.status(404).json({ error: 'GIG no encontrado' });
        }
        // verificar que el usuario sea el dueño del GIG
        if (gig.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para editar este GIG' });
        }

        if (req.body.cover) {
            // Eliminar la imagen anterior de Cloudinary si se sube un nuevo cover
            const imageId = gig.cover;
            if (imageId && req.body.cover !== imageId) {
                await deleteFromCloudinary(imageId);
            }
            gig.cover = req.body.cover;
        }

        if (req.body.images) {
            // Eliminar las imágenes anteriores de Cloudinary si se suben nuevas imágenes
            const imagesIds = gig.images;
            if (imagesIds && imagesIds.length > 0) {
                await Promise.all(
                    imagesIds.map(async (id) => {
                        if (!req.body.images.includes(id)) {
                            await deleteFromCloudinary(id);
                        }
                    })
                );
            }
            gig.images = req.body.images;
        }

        const updatedGig = { ...gig._doc, ...req.body }

        const update = await GigModel.findByIdAndUpdate(id, updatedGig, { new: true })

        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json(error)
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



export const deleteGig = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const gig = await GigModel.findById(id);

        if (!gig) {
            return res.status(404).json({ error: 'GIG no encontrado' });
        }

        // Verificar que seamos el dueño del GIG creado para poder eliminarlo
        if (gig.userId !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este GIG' });
        }

        // Extraer las URLs del cover y las imágenes
        const { cover, images } = gig;

        console.log(cover);
        console.log(images);



        if (cover) {
            // const publicId = cover.split('/').pop().split('.')[0];
            await deleteFromCloudinary(cover);
        }

        if (images && images.length > 0) {
            await Promise.all(
                images.map((image) => {
                    // const publicId = image.split('/').pop().split('.')[0];
                    return deleteFromCloudinary(image);
                })
            );
        }
        // Eliminar el GIG de la base de datos
        await GigModel.findByIdAndDelete(id);

        return res.status(200).json({ message: 'GIG eliminado' });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};

export const getGig = async (req = request, res = response) => {
    try {

        const gig = await GigModel.findById(req.params.id)
        if (!gig) {
            return res.sendStatus(404)
        }

        return res.status(200).json(gig)

    } catch (error) {
        return res.status(500).json(error)
    }
}
export const getGigs = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: { $regex: q.cat, $options: "i" } }),
        ...((q.min || q.max) && {
            price: {
                ...(q.min && { $gte: q.min }),
                ...(q.max && { $lte: q.max }),
            },
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };
    try {
        // const gigs = await GigModel.find(filters).sort({ createdAt: -1 })
        // const gigs = await GigModel.find(filters).sort({ createdAt: -1 })
        const gigs = await GigModel.find(filters).sort({ [q.sort]: -1 });
        res.status(200).send(gigs);
    } catch (err) {
        return res.status(500).json(err)
    }
};

// ESTO TIENE PAGINACION

// export const getGigs = async (req, res) => {
//     const q = req.query;
//     const filters = {
//         ...(q.userId && { userId: q.userId }),
//         ...(q.cat && { cat: { $regex: q.cat, $options: "i" } }),
//         ...((q.min || q.max) && {
//             price: {
//                 ...(q.min && { $gte: q.min }),
//                 ...(q.max && { $lte: q.max }),
//             },
//         }),
//         ...(q.search && { title: { $regex: q.search, $options: "i" } }),
//     };

//     const page = parseInt(q.page) || 1;
//     const perPage = parseInt(q.per_page) || 10;

//     try {
//         const totalGigs = await GigModel.countDocuments(filters);
//         const totalPages = Math.ceil(totalGigs / perPage);

//         const gigs = await GigModel.find(filters)
//             .sort({ [q.sort]: -1 })
//             .skip((page - 1) * perPage)
//             .limit(perPage);

//         res.status(200).json({
//             page,
//             per_page: perPage,
//             total: totalGigs,
//             total_pages: totalPages,
//             data: gigs,
//         });
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// };


export const addToWishlist = async (req, res) => {
    const { prodId } = req.body;
    const usuario = req.userId;

    try {
        const user = await UserModel.findById(usuario);
        const existeProdc = await GigModel.findById(prodId);
        if (!existeProdc) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const alreadyAdded = user?.wishList?.find((id) => id.toString() == prodId);

        if (alreadyAdded) {
            let updatedUser = await UserModel.findByIdAndUpdate(usuario, { $pull: { wishList: prodId } }, { new: true });
            return res.json(updatedUser);
        } else {
            let updatedUser = await UserModel.findByIdAndUpdate(usuario, { $push: { wishList: prodId } }, { new: true });

            return res.json(updatedUser);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
