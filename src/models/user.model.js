import mongoose , {Schema} from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
    {
    //make fields
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        Avatar: {
            type: String, //cloundinery url will be used here
            required: false,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type:String,
        }

    },
    {
        timestamps: true,
    }
)

UserSchema.pre("save" , async function(next) {
    if(! this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})//encription

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

UserSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this.id,
            email: this.email,
            fullname: this.fullname,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIN : process.env.ACCESS_TOKEN_EXPIRY,
        }
    ) //sign method is used to make token in jwt
}
UserSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIN : process.env.REFRESH_TOKEN_EXPIRY,
        }
    ) //sign method is used to make token in jwt
}

export const User = mongoose.model("User" , UserSchema)
