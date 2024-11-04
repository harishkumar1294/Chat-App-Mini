import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const sendMessage = async (req, res) => {
    try {
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
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

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
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


//Backup

// import Conversation from '../models/conversation.model.js'
// import Message from '../models/message.model.js';
// import { getReceiverSocketId, io } from '../socket/socket.js';

// export const sendMessage = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//         });

//         if(!conversation){
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId],
//             })
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             message,

//         });

//         if(newMessage){
//             conversation.messages.push(newMessage._id);
//         }


//         // await conversation.save();
//         // await newMessage.save();

//         // this will run in parallel

//         await Promise.all([conversation.save(), newMessage.save()]);


//         // SOCKET IO FUNCTIONALITY WILL GO HERE

//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if(receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", newMessage)
//         }

//         res.status(201).json(newMessage);

//     } catch (error) {
//         console.log("Error in sendMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
 
// export const getMessage = async (req, res) => {
//     try {
        
//         const {id:userToChatId} = req.params;
//         const senderId = req.user._id;

//         const conversation = await Conversation.findOne({
//             participants: {$all: [senderId, userToChatId]},
//         }).populate("messages");  // NOT REFERENCE BUT ACTUAL MESSAGES

//         if(!conversation) return res.status(200).json([]);

//         const messages = conversation.messages;

//         res.status(200).json(messages);

//     } catch (error) {

//         console.log("Error in getMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }