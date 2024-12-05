import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { aesEncrypt, aesDecrypt } from '../utils/encryption.js';

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body; // Message from the request body
        const { id: receiverId } = req.params; // Receiver ID from the request parameters
        const senderId = req.user._id; // Sender ID from authenticated user

        // Find an existing conversation or create a new one
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Encrypt the message
        const cipherMessage = aesEncrypt(message);

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message: cipherMessage,
            timestamp: new Date(),
        });

        // Add the message to the conversation
        conversation.messages.push(newMessage._id);

        // Save both the message and conversation in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // Emit the new message to the receiver if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                ...newMessage.toObject(),
                message, // Send the original (unencrypted) message to the receiver
                timestamp: newMessage.timestamp,
            });
        }

        // Send a success response with the new message
        res.status(201).json({
            ...newMessage.toObject(),
            message,
            timestamp: newMessage.timestamp, // Return the original message in the response
        });

    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // User to chat ID from request parameters
        const senderId = req.user._id; // Sender ID from authenticated user

        // Find the conversation between the sender and the user to chat
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // Populate the actual message documents

        // If no conversation exists, return an empty array
        if (!conversation) return res.status(200).json([]);

        // Decrypt each message and format the response
        const messages = conversation.messages.map((msg) => ({
            ...msg.toObject(),
            message: aesDecrypt(msg.message),
            timestamp: msg.timestamp, // Decrypt the message
        }));

        // Send the decrypted messages
        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in getMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};




// Backup 

// import Conversation from '../models/conversation.model.js'
// import Message from '../models/message.model.js';
// import { getReceiverSocketId, io } from '../socket/socket.js';
// import { caesarCipher } from '../utils/encryption.js';

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

//         const cipherMessage =  caesarCipher(message, 3);
//         let newMessage = new Message({
//             senderId,
//             receiverId,
//             message: cipherMessage,

//         });

//         if(newMessage){
//             conversation.messages.push(newMessage._id);
//         }



//         // await conversation.save();
//         // await newMessage.save();

//         // this will run in parallel

//         await Promise.all([conversation.save(), newMessage.save()]);


//         // SOCKET IO FUNCTIONALITY WILL GO HERE
//                 newMessage = new Message({
//             senderId,
//             receiverId,
//             message,

//         });
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

//         // const messages = conversation.messages;
//         const messages = conversation.messages.map(msg => ({
//             ...msg.toObject(),
//             message: caesarCipher(msg.message, -3), // Decrypt with negative shift
//         }));
//         res.status(200).json(messages);

//     } catch (error) {

//         console.log("Error in getMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }








//2nd backup code 

// import Conversation from '../models/conversation.model.js';
// import Message from '../models/message.model.js';
// import { getReceiverSocketId, io } from '../socket/socket.js';
// import crypto from 'crypto';

// // Generate a key and IV for AES encryption (Store these securely in production)
// const encryptionKey = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : crypto.randomBytes(32); // 256-bit key
// const iv = process.env.ENCRYPTION_IV ? Buffer.from(process.env.ENCRYPTION_IV, 'hex') : crypto.randomBytes(16); // Initialization vector

// // Encryption function
// function encrypt(text) {
//     const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return `${iv.toString('hex')}:${encrypted}`;
// }

// // Decryption function
// function decrypt(encryptedText) {
//     const [ivHex, encrypted] = encryptedText.split(':');
//     const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, Buffer.from(ivHex, 'hex'));
//     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }

// export const sendMessage = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         // Encrypt the message before saving it
//         const encryptedMessage = encrypt(message);

//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//         });

//         if (!conversation) {
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId],
//             });
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             message: encryptedMessage, // Store the encrypted message
//         });

//         if (newMessage) {
//             conversation.messages.push(newMessage._id);
//         }

//         // Save the conversation and new message in parallel
//         await Promise.all([conversation.save(), newMessage.save()]);

//         // SOCKET IO FUNCTIONALITY
//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", newMessage);
//         }

//         res.status(201).json(newMessage);

//     } catch (error) {
//         console.log("Error in sendMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const getMessage = async (req, res) => {
//     try {
//         const { id: userToChatId } = req.params;
//         const senderId = req.user._id;

//         const conversation = await Conversation.findOne({
//             participants: { $all: [senderId, userToChatId] },
//         }).populate("messages");

//         if (!conversation) return res.status(200).json([]);

//         // Decrypt each message before sending to frontend
//         const messages = conversation.messages.map(msg => ({
//             ...msg.toObject(),
//             message: decrypt(msg.message),
//         }));

//         res.status(200).json(messages);

//     } catch (error) {
//         console.log("Error in getMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


// Backup

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



//2nd backup code 

// import Conversation from '../models/conversation.model.js';
// import Message from '../models/message.model.js';
// import { getReceiverSocketId, io } from '../socket/socket.js';
// import crypto from 'crypto';

// // Generate a key and IV for AES encryption (Store these securely in production)
// const encryptionKey = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : crypto.randomBytes(32); // 256-bit key
// const iv = process.env.ENCRYPTION_IV ? Buffer.from(process.env.ENCRYPTION_IV, 'hex') : crypto.randomBytes(16); // Initialization vector

// // Encryption function
// function encrypt(text) {
//     const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return `${iv.toString('hex')}:${encrypted}`;
// }

// // Decryption function
// function decrypt(encryptedText) {
//     const [ivHex, encrypted] = encryptedText.split(':');
//     const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, Buffer.from(ivHex, 'hex'));
//     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }

// export const sendMessage = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         // Encrypt the message before saving it
//         const encryptedMessage = encrypt(message);

//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//         });

//         if (!conversation) {
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId],
//             });
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             message: encryptedMessage, // Store the encrypted message
//         });

//         if (newMessage) {
//             conversation.messages.push(newMessage._id);
//         }

//         // Save the conversation and new message in parallel
//         await Promise.all([conversation.save(), newMessage.save()]);

//         // SOCKET IO FUNCTIONALITY
//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", newMessage);
//         }

//         res.status(201).json(newMessage);

//     } catch (error) {
//         console.log("Error in sendMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const getMessage = async (req, res) => {
//     try {
//         const { id: userToChatId } = req.params;
//         const senderId = req.user._id;

//         const conversation = await Conversation.findOne({
//             participants: { $all: [senderId, userToChatId] },
//         }).populate("messages");

//         if (!conversation) return res.status(200).json([]);

//         // Decrypt each message before sending to frontend
//         const messages = conversation.messages.map(msg => ({
//             ...msg.toObject(),
//             message: decrypt(msg.message),
//         }));

//         res.status(200).json(messages);

//     } catch (error) {
//         console.log("Error in getMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
