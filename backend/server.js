import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // To parse incoming JSON requests
app.use(cookieParser()); // To parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Send index.html for any other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

// Function to start server and connect to MongoDB
const startServer = async () => {
    await connectToMongoDB();
    server.listen(PORT, () => {
        console.log(`Server Running on port ${PORT}`);
    });
};

// Start the server
startServer().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});



//backup

// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/auth.routes.js";
// import messageRoutes from "./routes/message.routes.js";
// import userRoutes from "./routes/user.routes.js";

// import connectToMongoDB from "./db/connectToMongoDB.js";
// import { app, server } from "./socket/socket.js";

// dotenv.config();

// const __dirname = path.resolve();

// const PORT= process.env.PORT || 5000;



// app.use(express.json()); //to parse the incoming requests with JSON payloads (from req.body) 
// app.use(cookieParser());

// app.use("/api/auth",authRoutes);
// app.use("/api/messages",messageRoutes);
// app.use("/api/users", userRoutes);

// app.use(express.static(path.join(__dirname,"/frontend/dist")))

// app.get("*", (req,res) => {
//     res.sendFile(path.join(__dirname,"frontend", "dist" , "index.html"))
// })


// server.listen(PORT,() => {
//     connectToMongoDB();
//     console.log(`Server Running on port ${PORT}`)
// });