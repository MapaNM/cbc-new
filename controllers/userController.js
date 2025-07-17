import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
                    "cbc-6503"
                )

                res.json({
                    token : token,
                    message : "User logged in successfully"
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