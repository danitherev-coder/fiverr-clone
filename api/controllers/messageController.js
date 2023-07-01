import { request, response } from "express"
import MessageModel from "../models/MessageModel.js"
import ConversationModel from "../models/ConversationModel.js"

export const createMessage = async (req = request, res = response) => {

    const newMessage = new MessageModel({
        conversationId: req.body.conversationId,
        userId: req.userId,
        desc: req.body.desc
    })

    try {
        const savedMessage = await newMessage.save()
        await ConversationModel.findOneAndUpdate({ id: req.body.conversationId }, {
            $set: {
                readyBySeller: req.isSeller,
                readyByBuyer: !req.isSeller,
                lastMessage: req.body.desc,
            }
        }, { new: true })

        res.status(200).json(savedMessage)

    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getMessages = async (req = request, res = response) => {

    try {
        const messages = await MessageModel.find({ conversationId: req.params.id })
        res.status(200).json(messages)

    } catch (error) {
        return res.status(500).json(error)
    }
}
