const express=require("express");
const catchAsyncError=require("../middleware/catchAsyncError");
const Shop=require("../model/shop");
const ErrorHandler=require("../utills/ErrorHandler");
const { isSeller }=require('../middleware/auth');
const CoupounCode=require("../model/coupouncode");
const router=express.Router();



router.post("/create-coupon-code",
    isSeller,
    catchAsyncError(async(req,res,next)=>{
        try{
           const isCoupounCodeExists=await CoupounCode.find({
            name:req.body.name
           });
           if(isCoupounCodeExists.length!==0){
            return next(new ErrorHandler("CoupounCode already exists!",400));
           }
           const coupounCode=await CoupounCode.create(req.body);
           res.status(201).json({
            success:true,
            coupounCode,
           });
        }catch(error){
           return next(new ErrorHandler(error,400));
        }
    })
);


router.get("/get-coupon/:id",
    isSeller,
    catchAsyncError(async(req,res,next)=>{
        try{
           const couponCode=await CoupounCode.find({shopId:req.seller.id});
           res.status(201).json({
            success:true,
            couponCode
           })
        }catch(error){
             return next(new ErrorHandler(error,400));
        } 
    })
);

router.delete("/delete-coupon/:id",
    isSeller,
    catchAsyncError(async(req,res,next)=>{
        try{
          const couponcode=await CoupounCode.findByIdAndDelete(req.params.id);
          if(!couponcode){
            return next(new ErrorHandler("Couponcode doesn't exists!",400))
          }
          res.status(201).json({
            success:true,
            message:"Couponcode deleted Successfully!",
          });
        }catch(error){
           return next(new ErrorHandler(error,400))
        }
    })
)

router.get(
  "/get-coupon-value/:name",
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports=router