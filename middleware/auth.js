const ErrorHandler=require("../utills/ErrorHandler");
const catchAsyncError=require('./catchAsyncError');
const jwt=require('jsonwebtoken');
const User=require("../model/user");
const Shop = require("../model/shop");


exports.isAuthenticated=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to continue",401));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decoded.id);
    if(!req.user){
        return next(new ErrorHandler("User not found",401));
    }
    next();
});

exports.isSeller = catchAsyncError(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(
    seller_token,
    process.env.JWT_SECRET
  );

  const seller = await Shop.findById(decoded.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 401));
  }

  req.seller = seller;

  next();
});
