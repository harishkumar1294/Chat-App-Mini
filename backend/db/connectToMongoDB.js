import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        const uri = process.env.MONGO_DB_URI; // Update to match your .env variable name
        if (!uri) {
            throw new Error('MongoDB URI is not defined in environment variables.');
        }
        
        console.log("MongoDB URI:", uri); // Debugging line
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Rethrow error to handle it in the server.js
    }
};

export default connectToMongoDB;






//Backup 

// import mongoose from "mongoose";


// const connectToMongoDB = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_DB_URI)
//         console.log("Connected to MongoDB");
//     }catch(error){
//         console.log("Error connecting to MongoDB",error.message)
//     }
// }

// export default connectToMongoDB;

