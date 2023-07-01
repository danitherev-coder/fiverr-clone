import { request, response } from "express"
import ReviewsModel from "../models/ReviewsModel.js"
import OrderModel from "../models/OrderModel.js"
import GigModel from "../models/GigModel.js"


export const getReviewBy = async (req = request, res = response) => {
    try {
        const reviews = await ReviewsModel.find({ gigId: req.params.gigId })

        return res.status(200).json(reviews)

    } catch (error) {
        return res.status(500).json(error)
    }
}



// export const createReview = async (req = request, res = response) => {
//     if (req.isSeller)
//         return res
//             .status(403)
//             .json({ msg: "Los vendedores no pueden realizar comentarios de sus publicaciones" });

//     try {
//         const existingReview = await ReviewsModel.findOne({
//             gigId: req.body.gigId,
//             userId: req.userId,
//         });

//         if (existingReview) {
//             // Si ya existe una revisión para la publicación y el usuario, actualizarla
//             existingReview.desc = req.body.desc;
//             existingReview.star = req.body.star;
//             const updatedReview = await existingReview.updateOne();
//             return res.status(200).json(updatedReview);
//         }

//         // SSolo el que compró el gig puede dejar una reseña
//         const order = await OrderModel.findOne({
//             gigId: req.body.gigId,
//             buyerId: req.userId,
//             isCompleted: true,
//         });

//         if (!order) {
//             return res.status(403).json({
//                 msg: "Solo los compradores pueden dejar comentarios en las publicaciones"
//             });
//         }


//         const newReview = new ReviewsModel({
//             userId: req.userId,
//             gigId: req.body.gigId,
//             desc: req.body.desc,
//             star: req.body.star,
//         });

//         const savedReview = await newReview.save();
//         return res.status(201).json(savedReview);
//     } catch (error) {
//         return res.status(500).json(error);
//     }
// };

export const createReview = async (req = request, res = response) => {
    // if (req.isSeller) {
    //     return res.status(403).json({
    //         msg: "Los vendedores no pueden realizar comentarios de sus publicaciones",
    //     });
    // }

    try {
        const existingReview = await ReviewsModel.findOne({
            gigId: req.body.gigId,
            userId: req.userId,
        });

        if (existingReview) {
            // Si ya existe una revisión para la publicación y el usuario, actualizarla
            existingReview.desc = req.body.desc;
            existingReview.star = req.body.star;
            const updatedReview = await existingReview.updateOne();

            // Obtener todas las reviews asociadas al gig
            const reviews = await ReviewsModel.find({ gigId: req.body.gigId });

            // Calcular el promedio de estrellas
            const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
            const starNumber = reviews.length;

            // Actualizar el modelo Gig con las nuevas estrellas
            const gig = await GigModel.findById(req.body.gigId);
            gig.totalStars = totalStars;
            gig.starNumber = starNumber;
            await gig.save();

            return res.status(200).json(updatedReview);
        }

        // Solo el que compró el gig puede dejar una reseña
        const order = await OrderModel.findOne({
            gigId: req.body.gigId,
            buyerId: req.userId,
            isCompleted: true,
        });

        if (!order) {
            return res.status(403).json({
                msg: "Solo los compradores pueden dejar comentarios en las publicaciones",
            });
        }

        const newReview = new ReviewsModel({
            userId: req.userId,
            gigId: req.body.gigId,
            desc: req.body.desc,
            star: req.body.star,
        });

        const savedReview = await newReview.save();

        // Obtener todas las reviews asociadas al gig
        const reviews = await ReviewsModel.find({ gigId: req.body.gigId });

        console.log(reviews, ' esto es el console para ver si encontro los gigs asociados');

        // Calcular el promedio de estrellas
        const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
        const starNumber = reviews.length;

        // Actualizar el modelo Gig con las nuevas estrellas
        const gig = await GigModel.findById(req.body.gigId);
        gig.totalStars = totalStars;
        gig.starNumber = starNumber;
        await gig.save();

        return res.status(201).json(savedReview);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};



// export const updateReview = async (req = request, res = response) => {
//     try {
//         const { id } = req.params; // Obtén el ID de la revisión de los parámetros de la solicitud
//         const { desc, star } = req.body; // Obtén los nuevos valores de descripción y estrellas de la solicitud

//         // Busca la revisión por su ID y el usuario actual
//         const review = await ReviewsModel.findOne({ _id: id, userId: req.userId });

//         if (!review) {
//             return res.status(404).json({ error: "Revisión no encontrada" });
//         }

//         // Actualiza los campos relevantes de la revisión
//         review.desc = desc;
//         review.star = star;
//         const updatedReview = await review.save();

//         return res.status(200).json(updatedReview);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(error);
//     }
// };


export const updateReview = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { desc, star } = req.body;

        const review = await ReviewsModel.findOne({ _id: id, userId: req.userId });

        if (!review) {
            return res.status(404).json({ error: "Revisión no encontrada" });
        }

        const gig = await GigModel.findById(review.gigId);

        // Actualiza los campos relevantes de la revisión
        review.desc = desc;
        review.star = star;
        const updatedReview = await review.save();

        // Obtén todas las reviews asociadas al gig
        const reviews = await ReviewsModel.find({ gigId: gig._id });

        // Calcular el promedio de estrellas actualizado
        const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
        const starNumber = reviews.length;

        // Actualizar el modelo Gig con las nuevas estrellas
        gig.totalStars = totalStars;
        gig.starNumber = starNumber;
        await gig.save();

        return res.status(200).json(updatedReview);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
