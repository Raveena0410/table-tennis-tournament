const mongoose=require('mongoose')
const signupschema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

})
const sign=mongoose.model("signup",signupschema);
module.exports=sign;