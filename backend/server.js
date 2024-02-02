const app=require('./app');
const dotenv=require('dotenv');
const connectDatabase=require('./config/database');
const cloudinary=require("cloudinary");

//handling uncaught exceptions
process.on("uncaughtException",(err)=>{
    console.log(`Error :${err.message}`);
    console.log(`Shutting down server due to uncaught Exception`);
    process.exit(1);
})


//config
dotenv.config({path:"backend/config/config.env"})

//connect to database
connectDatabase();

//cloudinary for images
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})

//unhandledd promise rejection- eg database url galat hogya to, jab bhi aisa kuch error aajaye to intentionally
//server crash krdenge

process.on("unhandledRejection",err=>{
    console.log(`Error :${err.message}`);
    console.log(`Shutting down server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})
