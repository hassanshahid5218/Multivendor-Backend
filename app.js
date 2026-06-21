const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");

const ErrorHandler = require("./middleware/error");
const connectDataBase = require("./db/Database");

// Controllers
const user = require("./controller/user");
const payment = require("./controller/payment");
const order = require("./controller/order");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupouncode");
const withdraw = require("./controller/withdraw");
const conversation = require("./controller/conversation");
const message = require("./controller/message");


// Load .env only in local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(__dirname, "config", ".env"),
  });
}


// Database connection
connectDataBase();


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// CORS
const allowedOrigins = [
  "https://multivendor-frontend-liart.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("upload"));


// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully",
  });
});


// API Routes
app.use("/api/v2/user", user);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/withdraw", withdraw);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);


// Error Handler
app.use(ErrorHandler);


module.exports = app;