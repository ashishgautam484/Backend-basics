import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", maxCount: 1
        },//we are handling two files here : avatar and coverImage
        {
            name: "coverImage", maxCount: 1
        }
    ]),
    registerUser
)//if anyone requests at /register route with post method then the control is transfer to registerUser function and upload will act as middleware to handle file upload



export default router