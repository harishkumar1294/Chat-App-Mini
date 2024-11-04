import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { body, validationResult } from 'express-validator'; // for data validation

// Middleware for validating incoming message data
export const validateMessage = [
    body('message').notEmpty().withMessage('Message cannot be empty'),
];

// Send message controller
export const sendMessage = async (req, res) => {
    try {
        // Validate incoming message
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Encrypt the message before storing it
        const encryptedMessage = encrypt(message);

        const newMessage = new Message({
            senderId,
            receiverId,
            message: encryptedMessage, // Store encrypted message
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save conversation and new message in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage controller: ", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

// Get message controller
export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        // Decrypt each message before sending to client
        const messages = conversation.messages.map(msg => {
            const decryptedContent = decrypt(msg.message);
            return { ...msg.toObject(), message: decryptedContent };
        });

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in getMessage controller: ", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
