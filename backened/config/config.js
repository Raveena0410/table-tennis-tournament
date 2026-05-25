const mongoose=require('mongoose')
require('dotenv').config()
async function connectdb(){
    try{

     await mongoose.connect(process.env.MONGO_URL);
     console.log('mongodb is connected')
         }
         catch(err){
            console.log(err)
         }

}

module.exports=connectdb;