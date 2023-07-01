import { request, response } from "express"
import ConversationModel from "../models/ConversationModel.js"

export const getConversations = async (req = request, res = response) => {
    try {
        const conversations = await ConversationModel.find(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }).sort({ updatedAt: -1 })
        return res.status(200).json(conversations)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getSingleConversation = async (req = request, res = response) => {
    try {
        const conversation = await ConversationModel.findOne({ id: req.params.id })

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" })
        }

        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const createConversation = async (req = request, res = response) => {


    const newConversation = new ConversationModel({
        id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
        sellerId: req.isSeller ? req.userId : req.body.to,
        buyerId: req.isSeller ? req.body.to : req.userId,
        readyBySeller: req.isSeller,
        readyByBuyer: !req.isSeller,
    })

    try {
        const savedConversation = await newConversation.save()
        return res.status(201).json(savedConversation)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const updateConversation = async (req = request, res = response) => {


    try {
        const updatedConversation = await ConversationModel.findOneAndUpdate({ id: req.params.id }, {
            $set: {
                // readyBySeller: true,
                // readyByBuyer: true,
                ...(req.isSeller ? { readyBySeller: true } : { readyByBuyer: true })
            }
        }, { new: true })

        return res.status(200).json(updatedConversation)

    } catch (error) {
        return res.status(500).json(error)
    }
}
