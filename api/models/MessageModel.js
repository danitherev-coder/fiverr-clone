import { Schema, model } from 'mongoose'

const MessageModel = new Schema({
    conversationId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default model('Message', MessageModel)