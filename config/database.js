import mongoose from "mongoose";

// in config folder --> database se connect karne ka code yaha likhenge


const connectDB = async ()=>{
    
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Database Successfully");
}


export default connectDB;