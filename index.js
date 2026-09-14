import express from "express"
import connectDB from "./config/database.js";
import dotenv from "dotenv"
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chatRouter.js";

// process.env --> feature of node js, initially empty obj.... so .env file se content iss object mai "dotenv" dalega
dotenv.config();

const app = express();

// express.json() parses incoming JSON request data and converts it into a JS object, available through req.body
app.use(express.json());
app.use(cookieParser());




app.use("/user", userRouter);
app.use("/msg", messageRouter);
app.use("/chat", chatRouter);


// https://strikes.in/user/login
// https://strikes.in/user/logout
// https://strikes.in/user/signup
// https://strikes.in/user/profile


// https://strikes.in/msg/read
// https://strikes.in/msg/delete
// https://strikes.in/msg/edit



// login,signup,logout,profile: user related

// chat api:

// message banege api



const startServer = async ()=>{
    try{
        
        await connectDB();

       app.listen(process.env.PORT,()=>{
        console.log(`Server has started listenting at port ${process.env.PORT}`);
       })
    }
    catch(err){
        console.log(err);
    }
}


startServer();


// server start, server listen