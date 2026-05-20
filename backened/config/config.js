const mongoose=require('mongoose')
async function connectdb(){
    try{

     await mongoose.connect('mongodb://localhost:27017/tour');
     console.log('mongodb is connected')
         }
         catch(err){
            console.log(err)
         }

}

module.exports=connectdb;