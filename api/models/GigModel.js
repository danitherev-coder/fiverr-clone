import { Schema, model } from 'mongoose'

const GigModel = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    totalStars: {
        type: Number,
        default: 0,
    },
    starNumber: {
        type: Number,
        default: 0,
    },
    cat: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cover: {
        type: String,
        required: true,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
    },
    images: {
        type: [String],
        required: false,
        default: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"]
    },
    shortTitle: {
        type: String,
        required: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: Number,
        required: true
    },
    revision: {
        type: Number,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    sales: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

export default model('Gig', GigModel)