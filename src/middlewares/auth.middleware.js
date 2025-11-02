import { ApiErrorapi } from "../utils/ApiError.api";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler (async (req, res, next) => {
    //get token from headers
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")//token is always present in headers authorization in form of "Bearer tokenvalue " so we are removing bearer from it
    
        if(! token){
            throw new ApiErrorapi(401, "Access token is missing")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //decodedToken will have data after token and secret key match
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if(! user){
            throw new ApiErrorapi(404, "User not found")
        }
    
        req.user = user //attaching user to req object so that we can use it in next middlewares or controllers
        next()
    } 
    catch (error) {
        throw new ApiErrorapi(401, "Invalid or expired access token")
    }

});