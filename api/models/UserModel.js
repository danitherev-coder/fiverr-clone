import { Schema, model } from 'mongoose'

const UserModel = new Schema({
    username: {
        type: String,
        // required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    // estoy agregando esto
    wishList: [{
        type: Schema.Types.ObjectId,
        ref: "Gig"
    }],
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    google: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})


UserModel.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
}

export default model('User', UserModel)