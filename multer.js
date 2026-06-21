// const multer=require('multer');

// const storage=multer.diskStorage({
//     destination:function(req,res,cb){
//         cb(null,"upload/");
//     },
//     filename:function(req,file,cb){
//         const uniqueSuffix=Date.now()+ "_" + Math.round.apply(Math.random()+1e9);
//         const filename=file.originalname.split(".")[0];
//         cb(null,filename + "_" + uniqueSuffix + ".png");

//     },
// });

// exports.upload=multer({storage:storage});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "_" + Math.round(Math.random() * 1e9);

    const filename = file.originalname.split(".")[0];

    cb(null, filename + "_" + uniqueSuffix + ".png");
  },
});

exports.upload = multer({ storage });