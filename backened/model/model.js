// const mongoose=require('mongoose')
// const tourschema=new mongoose.Schema({
    teamA:{
        type:String,
        
    },
    teamB:{
        type:String,
        
    },
    set:[
        {
        teamA_set:{
            type:Number
        },
        teamB_set:{
            type:Number
        },
    }

    ],

    
    
    winner:{
        type:String,
    
    },
    date:{
        type:String,
    }
    

}
)
const matches =mongoose.model('match',tourschema)
module.exports=matches
