import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErrorapi} from "../utils/ApiError.api.js"  
import {User} from "../models/user.model.js"  
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
       throw new ApiErrorapi(500, "Token generation failed") 
    }
}

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

const loginUser = asyncHandler( async (req,res) => {
    //get user details from -> req.body
    // check username / email and password are provided
    //find user based on username / email
    //check password is correct or not
    // generate access token and refresh token
    //send this token with cookie 

    const {email, username, password} = req.body;

    if(!username || !password){
        throw new ApiErrorapi(400, "Username and password are required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })// User is database mode and we are finding user based on username or email

    if(! user){
        throw new ApiErrorapi(404, "User not found with this username or email")
    }

    const isPassValid = await user.isPasswordCorrect(password)
    if(! isPassValid){
        throw new ApiErrorapi(401, "Invalid password")
    }

    const {accessToken , accessTokenrefreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //sending cookies - by designing options
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}
        , "User logged in successfully")
    )
})

const logoutUser = asyncHandler( async (req,res) => {
    //get user id from req.user
    await User.findByIdAndUpdate(req.user._id,
         {
            $set: { refreshToken: null }     
         },
         {
            new: true, //to return the updated document
         }
    )
    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(0) //expire the cookie immediately
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, null, "User logged out successfully")
    )   
})


export {
    registerUser, 
     loginUser,
    logoutUser 
}