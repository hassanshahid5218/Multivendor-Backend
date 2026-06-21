const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const shopSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter shop name"],

    },
    email:{
        type:String,
        required:[true,"Please Enter shop email address"],
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[6,"Password should be greater then 6 characters"],
        select:false,
    },
    description:{
        type:String,
    },
    address:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    role:{
        type:String,
        default:"Seller",
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
    },
    zipCode:{
        type:Number,
        required:true,
    },
    withdrawMethod:{
       type:Object,
    },
    availableBalance:{
        type:Number,
        default:0,
    },
    transection:[
        {
            amount:{
                type:Number,
                required:true,
            },
            status:{
                type:String,
                default:"Processing"
            },
            createdAt:{
                type:Date,
                default:Date.now(),
            },
            updateedAt:{
                type:Date,
            },
        },
    ],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    resetpasswordToken:String,
    resetPasswordTime:Date,
});

shopSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
        return;
    }
    this.password=await bcrypt.hash(this.password,10)
});

shopSchema.methods.getJwtToken=function(){
    return jwt.sign({id: this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
    } )
}

shopSchema.methods.comparePassword=async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
    
};

module.exports=mongoose.model("shop",shopSchema);