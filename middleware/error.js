const Errorhandler=require('../utills/ErrorHandler');

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode|| 500;
    err.message=err.message || "Internal Server Error";

    if(err.name==="CastError"){
        const message=`Resource not found. Invalid ${err.path}`;
        err=new Errorhandler(message,400);
    }

    if(err.code===11000){
        const message=`Duplicate key ${Object.keys(err.keyValue)} entered`;
        err=new Errorhandler(message,400);
    }

    if(err.name==="JsonWebTokenError"){
        const message=`Your URL is invalid. Please try again later.`;
        err=new Errorhandler(message,400);
    }

    if(err.name==="TokenExpiredError"){
        const message=`Your URL is expired. Please try again.`;
        err=new Errorhandler(message,400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}