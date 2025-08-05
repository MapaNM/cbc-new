import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import studentRouter from "./routers/studentRouter.js"
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routers/productRouter.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()


app.use(bodyParser.json())

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization")
        if(value != null){
        const token = value.replace("Bearer ","")
        jwt.verify(token,process.env.JWT_KEY,
            (err,decoded)=>{
                if(decoded == null){
                    res.status(403).json({
                        message : "Unauthorized"
                    })
                }else{
                    req.user = decoded
                    next()

                }
                
            })
        }else{
            next()
        }
    }
)
const connectionString = process.env.MONGO_URL



mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to database")
    }
).catch(
    ()=>{
        console.log("Failed to connect to the database")
    }
)




app.use("/students",studentRouter)
app.use("/users", userRouter)
app.use("/products", productRouter)




app.listen(5005, 
   ()=>{
       console.log("server started")
   }
)
