// const express=require('express');
// const  path=require("path");
// const router=express.Router();
// const {upload}=require('../multer');
// const User=require('../model/user')
// const ErrorHandler=require('../utills/ErrorHandler');
// // const { JsonWebTokenError } = require('jsonwebtoken');
// const catchAsyncError=require('../middleware/catchAsyncError')
// const sendToken=require('../utills/jwtToken')
// const fs = require("fs").promises;
// const jwt=require('jsonwebtoken');
// const sendMail = require('../utills/sendMail');
// const {isAuthenticated}=require('../middleware/auth')
// const cloudinary=require('cloudinary')

// router.post('/create-user', upload.single("file"), async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     const userEmail = await User.findOne({ email });

//     if (userEmail) {
//       return next(new ErrorHandler("User already exists", 400));
//     }

//     const file = req.file;

//     const myCloud = await cloudinary.v2.uploader.upload(file.path, {
//       folder: "avatars",
//     });

//     const user = {
//       name,
//       email,
//       password,
//       avatar: {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       },
//     };

//     const activationtoken = createActivationToken(user);
//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//     const activationUrl = `${frontendUrl}/activation/${activationtoken}`;

//     await sendMail({
//       email: user.email,
//       subject: "Activate Your Account",
//       message: `Hello ${user.name}, please click on the link to activate your account ${activationUrl}`
//     });

//     res.status(201).json({
//       success: true,
//       message: "Please check your email to activate your account"
//     });

//   } catch (error) {
//     next(error);
//   }
// });
 
// const createActivationToken=(user)=>{
//     return jwt.sign(user,process.env.ACTIVATION_SECRET,{
//         expiresIn:'5m'
//     }
//     )
// }



// router.post("/activation",catchAsyncError(async(req,res,next)=>{
//   try {
//     const { activation_token } = req.body;

//     const newUser = jwt.verify(
//       activation_token,
//       process.env.ACTIVATION_SECRET
//     );

//     if (!newUser) {
//       return next(new ErrorHandler("Invalid token", 400));
//     }
//     const { name, email, password, avatar } = newUser;

//     let user = await User.findOne({ email });

//     if (user) {
//       return next(new ErrorHandler("User already exists", 400));
//     }
//     user = await User.create({
//       name,
//       email,
//       avatar,
//       password,
//     });

//     sendToken(user, 201, res);
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// })
// );


// router.post("/login-user",catchAsyncError(async(req,res,next)=>{
//     try{
//        const {email,password}=req.body;
//        if(!email||!password){
//         return next(new ErrorHandler("Please provide all fields!",400));
//        }
//        const user=await User.findOne({email}).select("+password");
//        if(!user){
//         return next(new ErrorHandler("User doesn't exixt!",400));
//        }
//        const isPasswordValid=await user.comparePassword(password);
//        if(!isPasswordValid){
//         return next(new ErrorHandler("Please provide the correct information",400));
//        }
//        sendToken(user,201,res);
//     }catch(error){
//         return next(new ErrorHandler(error.message,500));
//     }
// }))


// router.get("/getuser",isAuthenticated,catchAsyncError(async(req,res,next)=>{
//     try{
//        const user=await User.findById(req.user.id);
//        if(!user){
//         return next(new ErrorHandler("User doesn't exixts",400));
//        }
//        res.status(200).json({
//         success:true,
//         user,
//        })
//     }catch(error){
//            return next(new ErrorHandler(error.message,500));
//     }
// }))

// router.get("/logout",catchAsyncError(async(req,res,next)=>{
//   try{
//     res.cookie("token",null,{
//       expires:new Date(Date.now()),
//       httpOnly:true,
//       sameSite:"none",
//       secure:true,
//     });
//     res.status(201).json({
//       success:true,
//       message:"Logout Succrssfull",
//     });
//   }
//   catch(error){
//     return next(new ErrorHandler(error.message,500))
//   }
// })
// );

// router.get(
//   "/logout",
//   catchAsyncError(async (req, res, next) => {
//     try {
//       res.cookie("token", null, {
//         expires: new Date(Date.now()),
//         httpOnly: true,
//         sameSite: "none",
//         secure: true,
//       });
//       res.status(201).json({
//         success: true,
//         message: "Log out successful!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// // update user info
// router.put(
//   "/update-user-info",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     console.log("1. Route reached");

//     const { email, password, phoneNumber, name } = req.body;
//     console.log("2. Body extracted");

//     const user = await User.findOne({ email }).select("+password");
//     console.log("3. User found:", user);

//     if (!user) {
//       return next(new ErrorHandler("User not found", 400));
//     }

//     console.log("4. Checking password");
//     const isPasswordValid = await user.comparePassword(password);
//     console.log("5. Password checked");

//     if (!isPasswordValid) {
//       return next(
//         new ErrorHandler("Please provide the correct information", 400)
//       );
//     }

//     console.log("6. Updating user");

//     user.name = name;
//     user.email = email;
//     user.phoneNumber = phoneNumber;

//     await user.save();

//     console.log("7. Saved successfully");

//     res.status(201).json({
//       success: true,
//       user,
//     });
//   })
// );

// router.put(
//   "/update-avatar",
//   upload.single("file"),
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       let existsUser = await User.findById(req.user.id);

//       if (req.file) {
//         const imageId = existsUser.avatar.public_id;

//         if (imageId) {
//           await cloudinary.v2.uploader.destroy(imageId);
//         }

//         const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
//           folder: "avatars",
//           width: 150,
//         });

//         existsUser.avatar = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };
//       }

//       await existsUser.save();

//       res.status(200).json({
//         success: true,
//         user: existsUser,
//       });

//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.put(
//   "/update-user-addresses",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const user = await User.findById(req.user.id);

//       const sameTypeAddress = user.addresses.find(
//         (address) => address.addressType === req.body.addressType
//       );
//       if (sameTypeAddress) {
//         return next(
//           new ErrorHandler(`${req.body.addressType} address already exists`)
//         );
//       }

//       const existsAddress = user.addresses.find(
//         (address) => address._id === req.body._id
//       );

//       if (existsAddress) {
//         Object.assign(existsAddress, req.body);
//       } else {
//         // add the new address to the array
//         user.addresses.push(req.body);
//       }

//       await user.save();

//       res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.delete(
//   "/delete-user-address/:id",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const userId = req.user._id;
//       const addressId = req.params.id;

//       await User.updateOne(
//         {
//           _id: userId,
//         },
//         { $pull: { addresses: { _id: addressId } } }
//       );

//       const user = await User.findById(userId);

//       res.status(200).json({ success: true, user });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.put(
//   "/update-user-password",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const user = await User.findById(req.user.id).select("+password");

//       const isPasswordMatched = await user.comparePassword(
//         req.body.oldPassword
//       );

//       if (!isPasswordMatched) {
//         return next(new ErrorHandler("Old password is incorrect!", 400));
//       }

//       if (req.body.newPassword !== req.body.confirmPassword) {
//         return next(
//           new ErrorHandler("Password doesn't matched with each other!", 400)
//         );
//       }
//       user.password = req.body.newPassword;

//       await user.save();

//       res.status(200).json({
//         success: true,
//         message: "Password updated successfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// router.get(
//   "/user-info/:id",
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const user = await User.findById(req.params.id);

//       res.status(201).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// module.exports=router; 

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const ErrorHandler = require("../utills/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utills/jwtToken");
const sendMail = require("../utills/sendMail");
const { isAuthenticated } = require("../middleware/auth");

const { upload } = require("../multer");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utills/cloudinaryUpload");

// -------------------- CREATE USER --------------------
router.post(
  "/create-user",
  upload.single("file"),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const userEmail = await User.findOne({ email });

      if (userEmail) {
        return next(new ErrorHandler("User already exists", 400));
      }

      if (!req.file) {
        return next(new ErrorHandler("Avatar file is required", 400));
      }

      const myCloud = await uploadToCloudinary(req.file, "avatars");

      const user = {
        name,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };

      const activationtoken = createActivationToken(user);

      const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:3000";

      const activationUrl = `${frontendUrl}/activation/${activationtoken}`;

      await sendMail({
        email: user.email,
        subject: "Activate Your Account",
        message: `Hello ${user.name}, please click on the link to activate your account ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: "Please check your email to activate your account",
      });
    } catch (error) {
      next(error);
    }
  }
);

// -------------------- CREATE TOKEN --------------------
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// -------------------- ACTIVATE USER --------------------
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        password,
        avatar,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- LOGIN --------------------
router.post(
  "/login-user",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- GET USER --------------------
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- LOGOUT --------------------
router.get(
  "/logout",
  catchAsyncError(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- UPDATE USER INFO --------------------
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Incorrect credentials", 400));
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- UPDATE AVATAR --------------------
router.put(
  "/update-avatar",
  upload.single("file"),
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      if (req.file) {
        if (user.avatar?.public_id) {
          await deleteFromCloudinary(user.avatar.public_id);
        }

        const myCloud = await uploadToCloudinary(req.file, "avatars");

        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- USER INFO BY ID --------------------
router.get(
  "/user-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;