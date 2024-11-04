import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
connectToMongoDB();

app.use(express.json()); // to parse incoming JSON payloads
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Serve the frontend's main HTML file for all unspecified routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



//backup

// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/auth.routes.js";
// import messageRoutes from "./routes/message.routes.js";
// import userRoutes from "./routes/user.routes.js";

// import connectToMongoDb from "./db/connectToMongoDb.js";
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
//     connectToMongoDb();
//     console.log(`Server Running on port ${PORT}`)
// });