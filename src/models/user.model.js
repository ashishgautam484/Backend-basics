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
        Email: {
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
            required: true,
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

    this.password = bcrypt.hash(this.password, 10)
    next()
})

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
