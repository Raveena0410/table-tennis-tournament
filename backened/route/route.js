// const express = require("express");

// const Match = require("../model/model");
// const Team = require("../model/model1");
// const Login = require("../model/model2");

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const router = express.Router();

router.get('/match', async(req,res)=>{

   try{

      const data = await Match.find()

      res.json(data)

   }

   catch(err){

      res.status(500).json({message:err.message})

   }

})

router.post("/", async (req, res) => {

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

    });

    if (winner === teamA) {

      await Team.findOneAndUpdate(

        { team: teamA },

        {

          $inc: {

            played: 1,
            won: 1,
            score: 2,
            setwon: teamAsetwon,
            setlost: teamBsetwon,

          },

        },

        { upsert: true, new: true }

      );

      await Team.findOneAndUpdate(

        { team: teamB },

        {

          $inc: {

            played: 1,
            lost: 1,
            setwon: teamBsetwon,
            setlost: teamAsetwon,

          },

        },

        { upsert: true, new: true }

      );

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
            setlost: teamAsetwon,

          },

        },

        { upsert: true, new: true }

      );

      await Team.findOneAndUpdate(

        { team: teamA },

        {

          $inc: {

            played: 1,
            lost: 1,
            setwon: teamAsetwon,
            setlost: teamBsetwon,

          },

        },

        { upsert: true, new: true }

      );

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

      message: "Data saved successfully",

    });

  }

  catch (err) {

    console.log(err);

  }

});


// LEADERBOARD


router.get("/lead", async (req, res) => {

  try {

  
    await Team.updateMany(
      {},
      {
        $set: {
          played: 0,
          won: 0,
          lost: 0,
          score: 0,
          setwon: 0,
          setlost: 0,
          ratio: 0
        }
      }
    );

    
    const matches = await Match.find({
      winner: { $ne: "" }
    });

    // LOOP THROUGH MATCHES
    for (let match of matches) {

      let teamAsetwon = 0;
      let teamBsetwon = 0;

      match.set.forEach((item) => {

        if (item.teamA_set > item.teamB_set) {
          teamAsetwon++;
        }

        else {
          teamBsetwon++;
        }

      });

      const teamAData = await Team.findOne({
        team: match.teamA
      });

      const teamBData = await Team.findOne({
        team: match.teamB
      });

      // PLAYED
      teamAData.played += 1;
      teamBData.played += 1;

      // SETS
      teamAData.setwon += teamAsetwon;
      teamAData.setlost += teamBsetwon;

      teamBData.setwon += teamBsetwon;
      teamBData.setlost += teamAsetwon;

      // WINNER
      if (match.winner === match.teamA) {

        teamAData.won += 1;
        teamAData.score += 2;

        teamBData.lost += 1;

      }

      else {

        teamBData.won += 1;
        teamBData.score += 2;

        teamAData.lost += 1;

      }

      // RATIO
      teamAData.ratio =
        teamAData.setlost === 0
        ? teamAData.setwon
        : (teamAData.setwon / teamAData.setlost).toFixed(1);

      teamBData.ratio =
        teamBData.setlost === 0
        ? teamBData.setwon
        : (teamBData.setwon / teamBData.setlost).toFixed(1);

      await teamAData.save();
      await teamBData.save();

    }

    // FINAL SORT
    const leaderboard = await Team.find().sort({
      score: -1,
      ratio: -1
    });

    res.json(leaderboard);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Something went wrong"
    });

  }

});



// LOGIN


router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await Login.findOne({

      email,

    });

    if (!user) {

      return res.json({

        message: "user is not found",

      });

    }

    const match =
    await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {

      return res.json({

        message: "incorrect password",

      });

    }

    const token = jwt.sign(

      { userId: user._id },

      "secret-",

      { expiresIn: "1h" }

    );

    res.json({

      message: "login successfully",
      token,

    });

  }

  catch (err) {

    console.log(err);

  }

});




// GET ALL MATCHES

router.get("/", async (req, res) => {

  const p = await Match.find();

  res.json(p);

});




// ADD TEAM + GENERATE MATCHES


router.post("/addteam", async (req, res) => {

  try {

    
    // CHECK DUPLICATE TEAM
    

    const existingTeam =
    await Team.findOne({

      team: req.body.team

    });

    if (existingTeam) {

      return res.json({

        message:
        "Team already exists"

      });

    }

    const newTeam = new Team(req.body);

    await newTeam.save();

  
    // DELETE OLD MATCHES
    

    await Match.deleteMany();

    

    await Team.updateMany(

      {},

      {

        $set: {

          played: 0,
          won: 0,
          lost: 0,
          score: 0,
          setwon: 0,
          setlost: 0,
          ratio: 0

        }

      }

    );

    

    const teams = await Team.find().sort({

      team: 1,

    });

    let matches = [];

    let currentDate = new Date();

    for (let i = 0; i < teams.length; i++) {

      for (let j = i + 1; j < teams.length; j++) {

        const formattedDate =

        `${currentDate.getFullYear()}-${
        String(currentDate.getMonth() + 1)
        .padStart(2, '0')
        }-${
        String(currentDate.getDate())
        .padStart(2, '0')
        }`

        matches.push({

          teamA: teams[i].team,
          teamB: teams[j].team,
          winner: "",
          set: [],
          date: formattedDate,

        });

        currentDate.setDate(

          currentDate.getDate() + 1

        );

      }

    }

    

    await Match.insertMany(matches);

    res.json({

      message:
      "Team Added And Matches Generated",

    });

  }

  catch (err) {

    console.log(err);

  }

});




router.get("/teams", async (req, res) => {

  const data = await Team.find();

  res.json(data);

});





router.get("/matches", async (req, res) => {

  try {

    const data = await Match.find().sort({

      date: 1,

    });

    res.json(data);

  }

  catch (err) {

    console.log(err);

  }

});





router.put("/reschedule/:id", async (req, res) => {

  try {

    const { date } = req.body;

    
    const matches = await Match.find().sort({

      date: 1

    });

    
    const currentIndex = matches.findIndex(

      item =>
      item._id.toString() === req.params.id

    );

    if (currentIndex === -1) {

      return res.json({

        message: "Match not found"

      });

    }

    
    let nextDate = new Date(date);

   

    for (

      let i = currentIndex;

      i < matches.length;

      i++

    ) {

      let uniqueDateFound = false;

      while (!uniqueDateFound) {

      

        while (

          nextDate.getDay() === 0 ||

          nextDate.getDay() === 6

        ) {

          nextDate.setDate(
            nextDate.getDate() + 1
          );

        }

        // =====================================
        // FORMAT DATE
        // =====================================

        const formattedDate =

        `${nextDate.getFullYear()}-${
        String(nextDate.getMonth() + 1)
        .padStart(2, '0')
        }-${
        String(nextDate.getDate())
        .padStart(2, '0')
        }`;

        

        const existingMatch =
        await Match.findOne({

          date: formattedDate,

          _id: {

            $ne: matches[i]._id

          }

        });

        

        if (!existingMatch) {

          matches[i].date = formattedDate;

          await matches[i].save();

          uniqueDateFound = true;

        }

        

        else {

          nextDate.setDate(
            nextDate.getDate() + 1
          );

        }

      }

      
      nextDate.setDate(
        nextDate.getDate() + 1
      );

    }

    res.json({

      message:
      "Matches Rescheduled Successfully"

    });

  }

  catch (err) {

    console.log(err);

    res.json({

      message:
      "Something went wrong"

    });

  }

});

module.exports = router;
