import User from "../model/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { loginSchema, signupSchema } from "../validators/userValidators.js"
import Chat from "../model/chatSchema.js"
import Message from "../model/messageSchema.js"

// login
// logout
// signup
// profile

const createToken = (id, email) => {

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret key is missing");
    }

    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
}

const cookieOption = {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000
}

export const signup = async (req, res) => {
    try {
        // validate all this data
        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }
        const { name, age, email, password } = result.data;


        // email vala already exist tho nii krta
        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                // Security issue --> hacker can know this email already exist soln: Rate limiter
                message: "Email ID already exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const userCreated = await User.create({
            name,
            age, // if age not given -- undefined and will not create age field
            email,
            password: hashPassword
        });

        // token create karna hoga; id, email: payload
        const token = createToken(userCreated._id, email);

        // Sending this token to browser
        res.cookie("token", token, cookieOption);

        res.status(201).json({
            message: "User created successfully",
            name,
            age,
            email
        });
    }

    catch (err) {
        // khud ke liye error show
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })

    }
}

export const login = async (req, res) => {

    try {

        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

        const { email, password } = result.data;

        // verify the password
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        // match the password
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const token = createToken(existingUser._id, email);

        res.cookie("token", token, cookieOption);
        res.status(201).json({
            message: "User logged in successfully",
            name: existingUser.name,
            age: existingUser.age,
            email: existingUser.email,
            usage: existingUser.usage
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


export const logout = async (req, res) => {
    // token remove kar do browser se

    res.clearCookie("token", {
        httpOnly: true,
        secure: false
    })

    res.status(200).json({
        message: "User logged Out Successfully"
    })


}

// profile ko sirf mein dekhu or koi nhi
// authenticated user: vo sirf apni hi profile ko access kar sakta h
export const profile = async (req, res) => {
    try {
        // User already authenticated
        // Profile ki info send karo
        // Database ke andar call karni padegi aur us user ko search krna padega
        res.status(200).json({
            name: req.user.name,
            age: req.user.age,
            email: req.user.email,
            usage: req.user.usage
        })
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }

}


export const deleteAccount = async (req,res)=>{
    try{
        
        // find all the chatID which belong to user

        // Delete all the messages which belongs to the chatID: Messages Delete
        // Delete all the chatID which belong to this user: Delete wo ChatID; user belong
        // Delete user Profile: is user By its ID
    const userId = req.user._id;


    await Message.deleteMany({
      userId
    });

    await Chat.deleteMany({
      userId
    });

    await User.deleteOne({
      _id: userId
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      message: "Account deleted successfully"
    });
    }
    catch(err){
        res.status(500).json({
            messages: "Internal Server Error"
        })
    }
}