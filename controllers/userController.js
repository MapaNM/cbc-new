import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
const pw = "ijymdwrbufavebqm"
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "nadeeshmapa@gmail.com",
        pass: pw,
    },
});

export function createUser(req,res){

    const passwordHash = bcrypt.hashSync(req.body.password, 10);

    const userData = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : passwordHash
    }

    const user =  new User(userData)

    user.save().then(
        ()=>{
            res.json({
                message : "User Created Successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message : "Failed to Create User"
            })
        }
    )

}

export function loginUser(req,res){
    const email = req.body.email
    const password = req.body.password

    User.findOne(
        {
            email : req.body.email
        }
    ).then(
        (customer)=>{
           if (customer == null){
            res.status(404).json({
                message : "User not found"
            })
           }else{
            const isPasswordCorrect = bcrypt.compareSync(password,customer.password)
            if(isPasswordCorrect){

                const token = jwt.sign(
                    {
                        email : customer.email,
                        firstName : customer.firstName,
                        lastName : customer.lastName,
                        role : customer.role,
                        isBlocked : customer.isBlocked,
                        isEmailVerified : customer.isEmailVerified,
                        image : customer.image
                    },
                    process.env.JWT_KEY
                )

                res.json({
                    token : token,
                    message : "User logged in successfully",
                    role : customer.role
                })
            }else{
                res.status(401).json({
                    message : "Invalid Password"
                })
            }
           }
        }
    )
}

export function getUserProfile(req,res){
    if(req.user == null){
        res.status(404).json({
            message : "User not found"
        })
    }else{
        res.json(req.user)
    }
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }

    if(req.user.role == "Admin"){
        return true;
    }else{
        return false;
    }
}

export async function googleLogin(req, res) {
    const googletoken = req.body.token;

    if (!googletoken) {
        return res.status(400).json({ message: "Google token missing" });
    }

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${googletoken}`,
            },
        });

        const data = response.data;

        let user = await User.findOne({ email: data.email });

        if (user) {
            const token = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isBlocked: user.isBlocked,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image
                },
                process.env.JWT_KEY
            );

            return res.json({
                token,
                message: "Logged in successfully",
                role: user.role,
            });
        }

        // new user
        user = await User.create({
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name,
            role: "user",
            password: "123",
            isEmailVerified: true,
            isBlocked: false,
            image: data.picture,
        });

        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            },
            process.env.JWT_KEY
        );

        res.json({
            token,
            message: "Registered and logged in successfully",
            role: user.role,
        });

    } catch (error) {
        console.error("Error fetching Google user info", error);
        res.status(500).json({ message: "Failed to authenticate with Google" });
    }
}

export async function sendOTP(req, res){
    const email = req.body.email;
    //random number between 111111 n 999999
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    //delete all OTP from the email
    try {
        await OTP.deleteMany({ email: email })
        const newOTP = new OTP({ email: email, otp: otpCode});
        await newOTP.save();

        const message ={
            from : "nadeeshmapa@gmail.com",
            to : email,
            subject : "Your OTP Code",
            text : `Your OTP code is ${otpCode}`,
        }
        transporter.sendMail(message, (error, info)=> {
            if (error){
                console.error("Error sending email", email);
                res.status(500).json({ message: "Failed to send OTP"});
            }else{
                console.log("Email sent:", info.response);
                res.json({ message: "OTP sent successfully"});
            }
        });

    } catch {
        res.status(500).json({ message: "Failed to delete previous OTP's"});
    }
    
}

export async function resetPassword(req,res){
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const otp = req.body.otp;

    try {
        const otpRecord = await OTP.findOne({ email: email, otp: otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await User.updateOne({ email: email }, {  password: hashedPassword } ); 
        await OTP.deleteMany({ email: email });
        res.json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }   
    
}