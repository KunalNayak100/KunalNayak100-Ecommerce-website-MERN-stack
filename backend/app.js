const express=require("express");
const app=express();
const errorMiddleware=require("./middleware/error");
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");

//is line ki jaha neeche vali line so that cloudinray me large images bhi upload ho ske,express size limit 
// app.use(express.json());
app.use(express.json({
    limit: '50mb'
  }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
//route imports
const product=require("./routes/productRoutes");
const user=require("./routes/userRoutes");
const order=require("./routes/orderRoutes");
const payment=require("./routes/paymentRoute");


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);



//middleware for error
app.use(errorMiddleware)



module.exports=app;