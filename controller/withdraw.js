const Shop = require("../model/shop");
const ErrorHandler = require("../utills/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const Withdraw =require('../model/withdraw')
const sendMail = require("../utills/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    console.log("Controller start")
    try {
      const { amount } = req.body;
      console.log("Amount",amount)
      const data = {
        seller: req.seller,
        amount,
      };
      console.log("Data",data)
      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! `,
        });
        res.status(201).json({
          success: true,
        });
        console.log("mail send")
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }

      const withdraw = await Withdraw.create(data);
      console.log("withdraw created")
      const shop = await Shop.findById(req.seller._id);

      shop.availableBalance = shop.availableBalance - amount;

      await shop.save();
      console.log("shop updated")
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports=router