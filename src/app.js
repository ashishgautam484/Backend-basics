import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes import
import userRouter from "../src/routes/user.routes.js"

//routes decleration
app.use("/api/v1/users" , userRouter) // using middlewares, ->if user open this path in local server then the control is transfer to userRouters

//https://localhost:8000/api/v1/users/register

export {app}