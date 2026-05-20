const express = require('express')
const Match = require('../model/model')
const Team = require('../model/model1')
const Login=require('../model/model2')
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


const router = express.Router()

router.post('/', async (req, res) => {

   try {

      await Match.create(req.body);

      const { teamA, teamB, set, winner } = req.body;

      let teamAsetwon = 0;
      let teamBsetwon = 0;

      set.forEach((item) => {

         if (item.teamA_set > item.teamB_set) {
            teamAsetwon++;
         }

         else {
            teamBsetwon++;
         }

      })

      if (winner === teamA) {

         await Team.findOneAndUpdate(

            { team: teamA },

            {
               $inc: {
                  played: 1,
                  won: 1,
                  score: 2,
                  setwon: teamAsetwon,
                  setlost: teamBsetwon
               }
            },
             { upsert:true, new:true }

         )

         await Team.findOneAndUpdate(

            { team: teamB },

            {
               $inc: {
                  played: 1,
                  lost: 1,
                  setwon: teamBsetwon,
                  setlost: teamAsetwon
               }
            },
             { upsert:true, new:true }

         )

      }

      else {

         await Team.findOneAndUpdate(

            { team: teamB },

            {
               $inc: {
                  played: 1,
                  won: 1,
                  score: 2,
                  setwon: teamBsetwon,
                  setlost: teamAsetwon
               }
               
            },
             { upsert:true, new:true }

         )

         await Team.findOneAndUpdate(

            { team: teamA },

            {
               $inc: {
                  played: 1,
                  lost: 1,
                  setwon: teamAsetwon,
                  setlost: teamBsetwon
               }
                
            },
            { upsert:true, new:true }

         )

      }

      const teams = await Team.find();

      for (let item of teams) {

         if (item.setlost === 0) {

            item.ratio = item.setwon;

         }

         else {

            item.ratio = item.setwon / item.setlost;

         }

         await item.save();

      }

      res.json({

         message: "Data saved successfully"

      })

   }

   catch (err) {

      console.log(err);

   }

})

router.get('/lead', async (req, res) => {

   try {

      const t = await Team.find().sort({

         score: -1,
         ratio: -1

      })

      res.json(t);

   }

   catch (err) {

      console.log(err);

   }

})
router.post('/signup',async (req,res)=>{
   try{
   const{email,password}=req.body;
   const hashpassword=await bcrypt.hash(password,10);
   const user=new Login({
      email,
      password:hashpassword
   })
   await user.save()
   res.json({
      message:"register successfully"
   })
}
catch(err){
   res.json({
      message:"user is not registered"
   })
}



})
router.post('/login',async (req,res)=>{
   try{
      const{email,password}=req.body;
      const user=await Login.findOne({
         email
      })
      if(!user){
         res.json({
            message:"user is not found"
         })
      }
      const match=await bcrypt.compare(password,user.password)
      if(!match){
         res.json({
            message:"incorrect password"
         })
      }
       const token=jwt.sign(
        {userId:user._id},
        "secret-",
        {expiresIn:"1h"}

    )
    res.json({ token });


      

   }
catch(err){
   console.log(err)
}


})
router.get('/', async(req,res)=>{
   const p=await Match.find()
   res.json(p)
})
router.post('/addteam', async(req,res)=>{

    const newTeam = new Team(req.body)

    await newTeam.save()

    res.json({
        message: "Team Added"
    })

})
router.get('/teams', async(req,res)=>{

    const data = await Team.find()

    res.json(data)

})
// =====================================
// GENERATE MATCHES
// =====================================

router.post(
   '/generatematches',

   async(req,res)=>{

      try{

         const teams =
         await Team.find()

         let matches = []

         let currentDate =
         new Date()

         for(let i=0; i<teams.length; i++){

            for(let j=i+1; j<teams.length; j++){

               matches.push({

                  teamA:teams[i].team,

                  teamB:teams[j].team,

                  winner:"",

                  set:[],

                  date:new Date(currentDate)

               })

               currentDate.setDate(

                  currentDate.getDate()+1

               )

            }

         }

         await Match.insertMany(matches)

         res.json({

            message:"Matches Generated"

         })

      }

      catch(err){

         console.log(err)

      }

})
// =====================================
// GET MATCHES
// =====================================

router.get(
   '/matches',

   async(req,res)=>{

      try{

         const data =
         await Match.find()

         res.json(data)

      }

      catch(err){

         console.log(err)

      }

})
// =====================================
// RESCHEDULE MATCH
// =====================================

router.put(
   '/reschedule/:id',

   async(req,res)=>{

      try{

         const {date} = req.body

         const currentMatch =
         await Match.findById(

            req.params.id

         )

         currentMatch.date = date

         await currentMatch.save()

         const nextMatches =
         await Match.find({

            date:{

               $gt:currentMatch.date

            }

         }).sort({date:1})

         let nextDate =
         new Date(date)

         for(let item of nextMatches){

            nextDate.setDate(

               nextDate.getDate()+1

            )

            item.date =
            new Date(nextDate)

            await item.save()

         }

         res.json({

            message:"Match Rescheduled"

         })

      }

      catch(err){

         console.log(err)

      }

})

module.exports = router;