// const express=require("express");
// const {isSeller,isAuthenticated}=require('../middleware/auth');
// const catchAsyncError=require('../middleware/catchAsyncError');
// const router=express.Router();
// const Product=require('../model/product')
// const Order=require('../model/order');
// const Shop=require('../model/shop')
// const cloudinary=require("cloudinary")
// const ErrorHandler=require('../utills/ErrorHandler');

// router.post(
//   "/create-product",
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const shopId = req.body.shopId;

//       const shop = await Shop.findById(shopId);

//       if (!shop) {
//         return next(new ErrorHandler("Shop Id is invalid", 400));
//       }
//     //   console.log("req.body.images:", req.body.images);
//     //   console.log("req.body:", req.body);

//       let images = [];

//       if (typeof req.body.images === "string") {
//         images.push(req.body.images);
//       } else {
//         images = req.body.images || [];
//       }

//       const imagesLink = [];

//       for (let i = 0; i < images.length; i++) {
//         const result = await cloudinary.v2.uploader.upload(images[i], {
//           folder: "products",
//         });

//         imagesLink.push({
//           public_id: result.public_id,
//           url: result.secure_url,
//         });
//       }
//        console.log("images length:", images.length);
//        console.log("imagesLink:", imagesLink);
//       const productData = req.body;

//       productData.image = imagesLink;
//       productData.shop = shop;

//       const product = await Product.create(productData);

//       res.status(201).json({
//         success: true,
//         product,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   })
// );

// router.get("/get-all-products-shop/:id",catchAsyncError(async(req,res,next)=>{
//     try{
//       const products=await Product.find({shopId:req.params.id});
//       res.status(201).json({
//         success:true,
//         products,
//       });
//     }catch(error){
//       return next(new ErrorHandler(error,400))
//     }
// }))

// router.get(
//   "/get-all-products-shop",
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const products = await Product.find().sort({ createdAt: -1 });

//       res.status(201).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// router.delete("/delete-shop-product/:id",
//     isSeller,
//     catchAsyncError(async(req,res,next)=>{
//         try{
//            const product=await Product.findById(req.params.id);
//            if(!product){
//             return next(new ErrorHandler("Product is not find with this id",404));
//            }
//            for(let i=0;i<product.image.length;i++){
//             const result=await cloudinary.v2.uploader.destroy(product.image[i].public_id);
//            }
//            await product.deleteOne();
//            res.status(201).json({
//             success:true,
//             message:"Product Deleted Successfully"
//            })
//         }catch(error){
//             return next(new ErrorHandler(error,400));
//         }
//     })
// )

// router.put(
//   "/create-new-review",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const { user, rating, comment, productId, orderId } = req.body;

//       const product = await Product.findById(productId);

//       const review = {
//         user,
//         rating,
//         comment,
//         productId,
//       };

//       const isReviewed = product.reviews.find(
//         (rev) => rev.user._id === req.user._id
//       );

//       if (isReviewed) {
//         product.reviews.forEach((rev) => {
//           if (rev.user._id === req.user._id) {
//             (rev.rating = rating), (rev.comment = comment), (rev.user = user);
//           }
//         });
//       } else {
//         product.reviews.push(review);
//       }

//       let avg = 0;

//       product.reviews.forEach((rev) => {
//         avg += rev.rating;
//       });

//       product.ratings = avg / product.reviews.length;

//       await product.save({ validateBeforeSave: false });

//       await Order.findByIdAndUpdate(
//         orderId,
//         { $set: { "cart.$[elem].isReviewed": true } },
//         { arrayFilters: [{ "elem._id": productId }], new: true }
//       );

//       res.status(200).json({
//         success: true,
//         message: "Reviwed succesfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// module.exports=router;

const express = require("express");
const router = express.Router();

const catchAsyncError = require("../middleware/catchAsyncError");
const { isSeller, isAuthenticated } = require("../middleware/auth");

const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");

const ErrorHandler = require("../utills/ErrorHandler");

const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utills/cloudinaryUpload");

// -------------------- CREATE PRODUCT --------------------
router.post(
  "/create-product",
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;

      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid", 400));
      }

      let images = [];

      if (typeof req.body.images === "string") {
        images = [req.body.images];
      } else {
        images = req.body.images || [];
      }

      const imagesLink = [];

      for (let img of images) {
        if (!img) continue;

        const result = await uploadToCloudinary(img, "products");

        imagesLink.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const productData = req.body;

      productData.image = imagesLink;
      productData.shop = shop._id;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// -------------------- GET ALL PRODUCTS BY SHOP --------------------
router.get(
  "/get-all-products-shop/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find({ shop: req.params.id });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// -------------------- GET ALL PRODUCTS --------------------
router.get(
  "/get-all-products-shop",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// -------------------- DELETE PRODUCT --------------------
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      if (product.image?.length > 0) {
        for (let img of product.image) {
          if (img.public_id) {
            await deleteFromCloudinary(img.public_id);
          }
        }
      }

      await product.deleteOne();

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// -------------------- REVIEW --------------------
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user?._id?.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user?._id?.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;