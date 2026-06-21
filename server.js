// const app=require('./app.js')
// const connectDataBase = require('./db/Database.js')
// const cloudinary=require('cloudinary')


// process.on("uncaughtException",(err)=>{
//     console.log(`Error: ${err.message}`)
//     console.log('shutting down the server for handling uncaught exception')
// })

// if(process.env.NODE_ENV!=='production'){
//     require("dotenv").config({
//         path:'backend/config/.env'
//     })
// }

// connectDataBase();
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const server=app.listen(process.env.PORT,()=>{
//     console.log(`server is running on http://localhost:${process.env.PORT}`)
// })

// process.on("unhandledRejection",(err)=>{
//       console.log("Shutting doen the server for",err);
//       console.log("shutting down the server for unhandeled promise rejection")
//       server.close(()=>{
//         process.exit(1);
//       })
// })

const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.join(__dirname, "config", ".env"),
  });
}

const app = require("./app.js");
const connectDataBase = require("./db/Database.js");
const cloudinary = require("cloudinary");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server for handling uncaught exception");
});

connectDataBase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Shutting down the server for", err);
  console.log("Shutting down the server for unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});