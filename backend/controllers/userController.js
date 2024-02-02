const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto");
const cloudinary=require("cloudinary");

//register a user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  // const myCloud=await cloudinary.uploader.upload(req.body.avatar,
  // { public_id: "avatars" }, 
  // function(error, result) {console.log(result); });



  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

//login a user

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given both email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  //+password bcz user model me password -> select: false kra hua hai
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // /protocol bc zruri nhi h http hi ho, && host bcz zruri nhi h localhost ho, kuch aur bhi ho skta hai
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it`;

  try {

    await sendEmail({
      email:user.email,
      subject:"Flutes website password recovery",
      message
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
    
  } catch (error) {
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});

    return next(new ErrorHandler(error.message,500));
    
  }

  
});

//reset password
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{
  
  ///reset password link me token as a param hai, usko nikalenge, fir database me us token se uska user search krenge

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user=await User.findOne({resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()}
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if(req.body.password!=req.body.confirmPassword){
    return next(
      new ErrorHandler
      (
        "Password doesn't match",
        400
      )
    );
  }

  user.password=req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user,200,res);
});


///get user details

exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{

  const user=await User.findById(req.user.id);

  ///iski zrurat nhi h bcz ye route vhi access kr skta h jo login hoga
  // if(!user){
  //   return next(new ErrorHandler())
  // }

  res.status(200).json({
    success:true,
    user
  })
});

//update user password
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{

  const user=await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


///get all users-admin

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  
  const users=await User.find();
  
  res.status(200).json({
    success: true,
    users
  });
});

//get single user details-- admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  
  const user=await User.findById(req.params.id);
  
  if(!user){
    return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`,404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);


  ///yaha pe video me delete one ki jagah remove use kia h jo ki deprecate ho chuka hai
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});