// const express=require("express");
// const path=require("path");
// const router=express.Router();
// const jwt=require("jsonwebtoken");
// const sendMail=require('../utills/sendMail');
// const Shop=require('../model/shop');
// // const {isAuthenticated,isSeller}
// const cloudinary=require('cloudinary');
// const catchAsyncError=require("../middleware/catchAsyncError");
// const ErrorHandler=require('../utills/ErrorHandler');
// const sendShopToken = require("../utills/shopToken");
// const sendToken=require('../utills/jwtToken');
// const { isSeller } = require("../middleware/auth");
// const Product=require("../model/product")
// const Event=require("../model/event")
// router.post('/create-shop',catchAsyncError(async(req,res,next)=>{
//   //  console.log("REQ BODY:", req.body);
//   //  console.log("PHONE:", req.body.phoneNumber);
//   //  console.log("ZIP:", req.body.zipCode);
//     try{
//        const {email}=req.body;
//        const sellerEmail=await Shop.findOne({email});
//        if(sellerEmail){
//         return next(new ErrorHandler("User already exists",400));
//        }
//        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
//         folder:"avatars"
//        });
//        const seller={
//         name:req.body.name,
//         email:email,
//         password:req.body.password,
//         avatar:{
//             public_id:myCloud.public_id,
//             url:myCloud.secure_url,
//         },
//         address:req.body.address,
//         phoneNumber:req.body.phoneNumber,
//         zipCode:req.body.zipCode,
//        }
//       //  console.log("REQ BODY:", req.body);
//       //  console.log("SELLER OBJECT:", seller);
//        const activationToken=createActivationToken(seller);
//        const activationUrl=`http://localhost:3000/seller/activation/${activationToken}`;
//        try{
//         await sendMail({
//             email:seller.email,
//             subject:"Activation your shop",
//             message:`Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`
//         })
//         res.status(201).json({
//             success:true,
//             message:`Please check your email:- ${seller.email} to activate you shop`,
//         })
//        }catch(error){
//           return next(new ErrorHandler(error.message,500));
//        }
//     }catch(error){
//        return next(new ErrorHandler(error.message,400))
//     }
// }))

// const createActivationToken=(seller)=>{
//     return jwt.sign(seller,process.env.ACTIVATION_SECRET,{
//         expiresIn:"5m"
//     });
// };

// router.post(
//   "/activation",
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const { activation_token } = req.body;

//       const newSeller = jwt.verify(
//         activation_token,
//         process.env.ACTIVATION_SECRET
//       );

//       if (!newSeller) {
//         return next(new ErrorHandler("Invalid token", 400));
//       }
//       const { name, email, password, avatar, zipCode, address, phoneNumber } =
//         newSeller;

//       let seller = await Shop.findOne({ email });

//       if (seller) {
//         return next(new ErrorHandler("User already exists", 400));
//       }
//       // console.log("FULL BODY KEYS:", Object.keys(req.body));
//       seller = await Shop.create({
//         name,
//         email,
//         avatar,
//         password,
//         zipCode,
//         address,
//         phoneNumber,
//       });

//       sendShopToken(seller, 201, res);
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.post("/login-shop",catchAsyncError(async(req,res,next)=>{
//     try{
//        const {email,password}=req.body;
//        if(!email||!password){
//         return next(new ErrorHandler("Please provide all fields!",400));
//        }
//        const user=await Shop.findOne({email}).select("+password");
//        if(!user){
//         return next(new ErrorHandler("User doesn't exixt!",400));
//        }
//        const isPasswordValid=await user.comparePassword(password);
//        if(!isPasswordValid){
//         return next(new ErrorHandler("Please provide the correct information",400));
//        }
//        sendShopToken(user,201,res);
//     }catch(error){
//         return next(new ErrorHandler(error.message,500));
//     }
// }))

// router.get(
//   "/getSeller",
//   isSeller,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const seller = await Shop.findById(req.seller.id);

//       if (!seller) {
//         return next(new ErrorHandler("User doesn't exists", 400));
//       }

//       res.status(200).json({
//         success: true,
//         seller,
//       });

//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.get('/get-shop-info/:id',catchAsyncError(async(req,res,next)=>{
//   try{
//      const shop=await Shop.findById(req.params.id);
//      res.status(201).json({
//       success:true,
//       shop,
//      });
//   }catch(error){
//     return next(new ErrorHandler(error.message,500))
//   }
// }))

// router.get('/logout',
//   catchAsyncError(async(req,res,next)=>{
//     try{
//       res.cookie("seller_token",null,{
//         expires:new Date(Date.now()),
//         httponly:true,
//         sameSite:"none",
//         secure:true,
//       });
//       res.status(201).json({
//         success:true,
//         message:"Log out successfull",
//       })
//     }catch(error){
//       return next(new ErrorHandler(error.message,500));
//     }
//   })
// )

// router.put(
//   "/update-shop-avatar",
//   isSeller,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       let existsSeller = await Shop.findById(req.seller._id);

//       if (!existsSeller) {
//         return next(new ErrorHandler("Seller not found", 404));
//       }

//       // Remove old avatar from cloudinary
//       const imageId = existsSeller.avatar.public_id;

//       await cloudinary.v2.uploader.destroy(imageId);

//       // Upload new avatar
//       const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//         folder: "avatars",
//         width: 150,
//       });

//       // Update seller avatar
//       existsSeller.avatar = {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       };

//       await existsSeller.save();


//       // Update avatar inside all products
//       await Product.updateMany(
//         { shopId: existsSeller._id.toString() },
//         {
//           $set: {
//             "shop.avatar": existsSeller.avatar,
//           },
//         }
//       );


//       // Update avatar inside all events
//       await Event.updateMany(
//         { shopId: existsSeller._id.toString() },
//         {
//           $set: {
//             "shop.avatar": existsSeller.avatar,
//           },
//         }
//       );


//       res.status(200).json({
//         success: true,
//         seller: existsSeller,
//       });

//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.put(
//   "/update-seller-info",
//   isSeller,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const { name, description, address, phoneNumber, zipCode } = req.body;

//       const shop = await Shop.findById(req.seller._id);

//       if (!shop) {
//         return next(new ErrorHandler("Shop not found", 400));
//       }

//       // Update Shop document
//       shop.name = name;
//       shop.description = description;
//       shop.address = address;
//       shop.phoneNumber = phoneNumber;
//       shop.zipCode = zipCode;

//       await shop.save();

//       // Update shop information inside all products
//       await Product.updateMany(
//         { shopId: shop._id.toString() },
//         {
//           $set: {
//                       "shop.name": shop.name,
//                       "shop.description": shop.description,
//                       "shop.address": shop.address,
//                       "shop.phoneNumber": shop.phoneNumber,
//                       "shop.zipCode": shop.zipCode,
//                 },
//         }
//       );

//       // Update shop information inside all events
//       await Event.updateMany(
//         { shopId: shop._id.toString() },
//         {
//           $set: {
//                       "shop.name": shop.name,
//                       "shop.description": shop.description,
//                       "shop.address": shop.address,
//                       "shop.phoneNumber": shop.phoneNumber,
//                       "shop.zipCode": shop.zipCode,
//                 },
//         }
//       );

//       res.status(200).json({
//         success: true,
//         message: "Shop information updated successfully",
//         shop,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.put(
//   "/update-payment-methods",
//   isSeller,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const { withdrawMethod } = req.body;

//       const seller = await Shop.findByIdAndUpdate(req.seller._id, {
//         withdrawMethod,
//       });

//       res.status(201).json({
//         success: true,
//         seller,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// // delete seller withdraw merthods --- only seller
// router.delete(
//   "/delete-withdraw-method/",
//   isSeller,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const seller = await Shop.findById(req.seller._id);

//       if (!seller) {
//         return next(new ErrorHandler("Seller not found with this id", 400));
//       }

//       seller.withdrawMethod = null;

//       await seller.save();

//       res.status(201).json({
//         success: true,
//         seller,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// module.exports=router

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");

const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utills/ErrorHandler");
const { isSeller } = require("../middleware/auth");

const sendMail = require("../utills/sendMail");
const sendShopToken = require("../utills/shopToken");

// CREATE SHOP
router.post(
  "/create-shop",
  catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    const exists = await Shop.findOne({ email });
    if (exists) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
    });

    const seller = {
      name: req.body.name,
      email,
      password: req.body.password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const createActivationToken = (data) => {
      return jwt.sign(data, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
      });
    };

    const activationToken = createActivationToken(seller);

    const activationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/seller/activation/${activationToken}`;

    await sendMail({
      email,
      subject: "Activate Your Shop",
      message: `Hello ${seller.name}, click here: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Please check email: ${email} to activate your shop`,
    });
  })
);

// ACTIVATE SHOP
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    const { activation_token } = req.body;

    const data = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    const exists = await Shop.findOne({ email: data.email });
    if (exists) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const seller = await Shop.create(data);

    sendShopToken(seller, 201, res);
  })
);

// LOGIN SHOP
router.post(
  "/login-shop",
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const seller = await Shop.findOne({ email }).select("+password");

    if (!seller) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }

    const isMatch = await seller.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorHandler("Incorrect credentials", 400));
    }

    sendShopToken(seller, 200, res);
  })
);

// GET SELLER
router.get(
  "/getSeller",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    const seller = await Shop.findById(req.seller.id);

    if (!seller) {
      return next(new ErrorHandler("Seller not found", 400));
    }

    res.status(200).json({
      success: true,
      seller,
    });
  })
);

// GET SHOP INFO
router.get(
  "/get-shop-info/:id",
  catchAsyncError(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);

    res.status(200).json({
      success: true,
      shop,
    });
  })
);

// LOGOUT
router.get(
  "/logout",
  catchAsyncError(async (req, res) => {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  })
);

// UPDATE SHOP AVATAR
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      return next(new ErrorHandler("Seller not found", 404));
    }

    if (seller.avatar?.public_id) {
      await cloudinary.uploader.destroy(seller.avatar.public_id);
    }

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
    });

    seller.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await seller.save();

    await Product.updateMany(
      { shopId: seller._id.toString() },
      { $set: { "shop.avatar": seller.avatar } }
    );

    await Event.updateMany(
      { shopId: seller._id.toString() },
      { $set: { "shop.avatar": seller.avatar } }
    );

    res.status(200).json({
      success: true,
      seller,
    });
  })
);

// UPDATE SHOP INFO
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    const { name, description, address, phoneNumber, zipCode } = req.body;

    const shop = await Shop.findById(req.seller._id);

    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;

    await shop.save();

    await Product.updateMany(
      { shopId: shop._id.toString() },
      {
        $set: {
          "shop.name": shop.name,
          "shop.description": shop.description,
          "shop.address": shop.address,
          "shop.phoneNumber": shop.phoneNumber,
          "shop.zipCode": shop.zipCode,
        },
      }
    );

    await Event.updateMany(
      { shopId: shop._id.toString() },
      {
        $set: {
          "shop.name": shop.name,
          "shop.description": shop.description,
          "shop.address": shop.address,
          "shop.phoneNumber": shop.phoneNumber,
          "shop.zipCode": shop.zipCode,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop,
    });
  })
);

// UPDATE PAYMENT METHOD
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncError(async (req, res) => {
    const seller = await Shop.findByIdAndUpdate(
      req.seller._id,
      { withdrawMethod: req.body.withdrawMethod },
      { new: true }
    );

    res.status(200).json({
      success: true,
      seller,
    });
  })
);

// DELETE WITHDRAW METHOD
router.delete(
  "/delete-withdraw-method",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      return next(new ErrorHandler("Seller not found", 400));
    }

    seller.withdrawMethod = null;
    await seller.save();

    res.status(200).json({
      success: true,
      seller,
    });
  })
);

module.exports = router;