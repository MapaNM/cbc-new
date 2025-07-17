import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        default : "NOT GIVEN"
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    role : {
        type : String,
        default : "user"
    },
    isEmailVerified : {
        type : Boolean,
        default: false
    },
    image : {
        type : String,
        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fuser-profile&psig=AOvVaw1RenkqaRdCuTq_wsqBcY9m&ust=1750826071104000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDUz9WdiY4DFQAAAAAdAAAAABAE"
    }
})

const User = mongoose.model("users", userSchema)
 
export default User;  //export the model to use it in other files