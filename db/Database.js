const mongoose=require("mongoose")


const connectDataBase=()=>{
    mongoose.connect(process.env.MONGO).then((data)=>{
        console.log(`Database connected with server ${data.connection.host}`)
    })
}

module.exports=connectDataBase