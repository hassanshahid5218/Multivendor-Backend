const express=require('express');
const app=express();
const ErrorHandler = require("./middleware/error");
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const user=require("./controller/user");
const payment=require('./controller/payment')
const order=require('./controller/order')
const shop=require('./controller/shop')
const product=require('./controller/product')
const event=require('./controller/event')
const coupon=require('./controller/coupouncode')
const withdraw=require('./controller/withdraw')
const conversation=require('./controller/conversation')
const message=require('./controller/message')
const cors=require("cors")
const path = require('path');
if(process.env.NODE_ENV!=='production'){
    require("dotenv").config({
        path: path.resolve(__dirname, 'config', '.env')
    })
}
const allowedOrigins = [
  "https://multivendor-frontend-liart.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
     } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/',express.static("upload"));
app.use(bodyParser.urlencoded({extended:true}));




app.get("/", (req, res) => {
  res.send("Backend is working");
});



app.use("/api/v2/user",user);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order",order);
app.use("/api/v2/shop",shop);
app.use('/api/v2/product',product)
app.use('/api/v2/event',event)
app.use('/api/v2/coupon',coupon)
app.use('/api/v2/withdraw',withdraw)
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use(ErrorHandler); 

module.exports=app;