import mongoose from "mongoose";

const connectToMongoDB = async () => {
    const mongoURI = process.env.MONGO_DB_URI;

    if (!mongoURI) {
        console.error("Error: MongoDB URI (MONGO_DB_URI) is not defined in .env file.");
        process.exit(1); // Exit the application with a failure code
    }

    try {
        await mongoose.connect(mongoURI); // No options needed for Mongoose 6+
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the application if the connection fails
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

