// require('dotenv').config({path: "./env"})
import dotenv from "dotenv";
dotenv.config();



import mongoose from "mongoose"
import {DB_NAME} from "./constants.js"
import connectDB from "./db/index.js"

 


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`aanchal is love  : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGO_DB connection failed" , err);
    
})














/* FIRST APPROACH :
import express from "express"

; (async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI} /${DB_NAME}`)
        app.on("error" , ()=>{
            console.log("not able to listen from app " , error);
            throw error
        }) //listning

        app.listen(process.env.PORT , ()=>{
            console.log(`App is listening at port ${process.env.PORT}`);
        })


    } catch (error) {
        console.log("ERROR" , error)
        throw err
    }
} ) ()
    */