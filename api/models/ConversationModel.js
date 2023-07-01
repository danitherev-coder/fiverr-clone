import { Schema, model } from 'mongoose'

const ConversationModel = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    sellerId: {
        type: String,
        required: true
    },
    buyerId: {
        type: String,
        required: true
    },
    readyBySeller: {
        type: Boolean,
        default: true
    },
    readyByBuyer: {
        type: Boolean,
        default: true
    },
    lastMessage: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

export default model('Conversation', ConversationModel)