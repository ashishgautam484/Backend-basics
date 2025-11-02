import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErrorapi} from "../utils/ApiError.api.js"  
import {User} from "../models/user.model.js"  
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) => {
    //get user details from frontend
    //validation - not empty, valid email, password strength 
    //check if user already exists: username or email
    //check for images , avatar is required 
    //upload to cloudinery , avatar
    //create user object - create entry in db
    //remove password from response token field from response
    //check for user creation 
    //return response

    const {fullname, email, username, password} = req.body;
    console.log("email", email);

    // if(fullname == ""){
    //     throw new   ApiErrorapi (400 , "Fullname is required")
    // } can use this for all fields but better to use array and some method
    if(
        [fullname, email, username, password].some((feild)=>
        feild === "")
    ){
        throw new ApiErrorapi(400, "All feilds are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiErrorapi(409, "User already exists with this username or email")
    }

    const avatarLocalPath = req.files?.Avatar[0]?.path; //req.files is coming from multer middleware same as req.body from express json middleware
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiErrorapi(400, "Avatar image is required");
    }// checking avatar image is uploaded

    console.log("Files received:", req.files);

    const Avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiErrorapi(400, "Avatar image is required");
    } //checking one more time after upload

    const user = await User.create({
        fullname,
        email,
        username : username.toLowerCase(),
        avatar : Avatar?.url || "",
        coverImage : coverImage?.url || "",
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) //select method is used to exclude certain fields from the response
    if(! createdUser){
        throw new ApiErrorapi(500, "Something went wrong , user creation failed")
    } //checking user creation

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})

export {registerUser}