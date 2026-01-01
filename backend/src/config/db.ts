// backend/src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`🗄️ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
            console.error("An unknown error occurred during MongoDB connection.");
        }
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;