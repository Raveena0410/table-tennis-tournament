const express = require("express");

const Match = require("../model/model");
const Team = require("../model/model1");
const Login = require("../model/model2");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// =====================================
// UPDATE MATCH RESULT
router.post("/", async (req, res) => {

  try {

    const {

      teamA,
      teamB,
      set,
      winner

    } = req.body;

    const teamAName = teamA.trim();
    const teamBName = teamB.trim();

    console.log(teamAName);
    console.log(teamBName);

    // FIND MATCH
    const existingMatch =
    await Match.findOne({

      $or: [

        {

          teamA: teamAName,
          teamB: teamBName

        },

        {

          teamA: teamBName,
          teamB: teamAName

        }

      ]

    });

    console.log(existingMatch);

    // MATCH NOT FOUND
    if (!existingMatch) {

      return res.json({

        message: "Match not found"

      });

    }

    // UPDATE MATCH
    existingMatch.set = set;
    existingMatch.winner = winner;

    await existingMatch.save();

    // RESET STATS
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

    // GET COMPLETED MATCHES
    const completedMatches =
    await Match.find({

      winner: {

        $ne: ""

      }

    });

    // RECALCULATE
    for (let match of completedMatches) {

      let teamAsetwon = 0;
      let teamBsetwon = 0;

      match.set.forEach((item) => {

        if (

          Number(item.teamA_set) >
          Number(item.teamB_set)

        ) {

          teamAsetwon++;

        }

        else {

          teamBsetwon++;

        }

      });

      const teamAData =
      await Team.findOne({

        team: match.teamA

      });

      const teamBData =
      await Team.findOne({

        team: match.teamB

      });

      teamAData.played += 1;
      teamBData.played += 1;

      teamAData.setwon += teamAsetwon;
      teamAData.setlost += teamBsetwon;

      teamBData.setwon += teamBsetwon;
      teamBData.setlost += teamAsetwon;

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
      if (teamAData.setlost === 0) {

        teamAData.ratio =
        teamAData.setwon;

      }

      else {

        teamAData.ratio =
        (
          teamAData.setwon /
          teamAData.setlost
        ).toFixed(1);

      }

      if (teamBData.setlost === 0) {

        teamBData.ratio =
        teamBData.setwon;

      }

      else {

        teamBData.ratio =
        (
          teamBData.setwon /
          teamBData.setlost
        ).toFixed(1);

      }

      await teamAData.save();
      await teamBData.save();

    }

    res.json({

      message:
      "Match Updated Successfully"

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

// =====================================
// LEADERBOARD
// =====================================

router.get("/lead", async (req, res) => {

  try {

    // =====================================
    // GET ALL TEAMS
    // =====================================

    const teams = await Team.find();

    // =====================================
    // RESET ALL STATS
    // =====================================

    for (let team of teams) {

      team.played = 0;
      team.won = 0;
      team.lost = 0;
      team.score = 0;
      team.setwon = 0;
      team.setlost = 0;
      team.ratio = 0;

      await team.save();

    }

    // =====================================
    // GET COMPLETED MATCHES
    // =====================================

    const matches = await Match.find({

      winner: {

        $ne: ""

      }

    });

    // =====================================
    // CALCULATE STATS
    // =====================================

    for (let match of matches) {

      let teamAsetwon = 0;
      let teamBsetwon = 0;

      // =====================================
      // COUNT SETS
      // =====================================

      match.set.forEach((item) => {

        if (

          item.teamA_set >
          item.teamB_set

        ) {

          teamAsetwon++;

        }

        else {

          teamBsetwon++;

        }

      });

      // =====================================
      // TEAM A
      // =====================================

      const teamAData =
      await Team.findOne({

        team: match.teamA

      });

      // =====================================
      // TEAM B
      // =====================================

      const teamBData =
      await Team.findOne({

        team: match.teamB

      });

      // =====================================
      // PLAYED
      // =====================================

      teamAData.played += 1;
      teamBData.played += 1;

      // =====================================
      // SETS
      // =====================================

      teamAData.setwon += teamAsetwon;
      teamAData.setlost += teamBsetwon;

      teamBData.setwon += teamBsetwon;
      teamBData.setlost += teamAsetwon;

      // =====================================
      // WINNER
      // =====================================

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

      // =====================================
      // RATIOS
      // =====================================

      if (teamAData.setlost === 0) {

        teamAData.ratio =
        teamAData.setwon;

      }

      else {

        teamAData.ratio =
        (
          teamAData.setwon /
          teamAData.setlost
        ).toFixed(1);

      }

      if (teamBData.setlost === 0) {

        teamBData.ratio =
        teamBData.setwon;

      }

      else {

        teamBData.ratio =
        (
          teamBData.setwon /
          teamBData.setlost
        ).toFixed(1);

      }

      // =====================================
      // SAVE
      // =====================================

      await teamAData.save();
      await teamBData.save();

    }

    // =====================================
    // SORT LEADERBOARD
    // =====================================

    const leaderboard =
    await Team.find().sort({

      score: -1,
      ratio: -1

    });

    res.json(leaderboard);

  }

  catch (err) {

    console.log(err);

    res.json({

      message:
      "Something went wrong"

    });

  }

});



// =====================================
// SIGNUP
// =====================================

router.post("/signup", async (req, res) => {

  try {

    const { email, password } = req.body;

    const hashpassword =
    await bcrypt.hash(password, 10);

    const user = new Login({

      email,
      password: hashpassword,

    });

    await user.save();

    res.json({

      message: "register successfully",

    });

  }

  catch (err) {

    res.json({

      message: "user is not registered",

    });

  }

});



// =====================================
// LOGIN
// =====================================

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



// =====================================
// GET ALL MATCHES
// =====================================

router.get("/", async (req, res) => {

  const p = await Match.find();

  res.json(p);

});



// =====================================
// ADD TEAM + GENERATE MATCHES
// =====================================

router.post("/addteam", async (req, res) => {

  try {

    // =====================================
    // CHECK DUPLICATE TEAM
    // =====================================

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

    // =====================================
    // DELETE OLD MATCHES
    // =====================================

    await Match.deleteMany();

    // =====================================
    // RESET TEAM STATS
    // =====================================

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

    // =====================================
    // GET ALL TEAMS
    // =====================================

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

    // =====================================
    // SAVE MATCHES
    // =====================================

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



// =====================================
// GET ALL TEAMS
// =====================================

router.get("/teams", async (req, res) => {

  const data = await Team.find();

  res.json(data);

});



// =====================================
// GET SORTED MATCHES
// =====================================

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



// =====================================
// RESCHEDULE MATCH
// =====================================

router.put("/reschedule/:id", async (req, res) => {

  try {

    const { date } = req.body;

    // =====================================
    // GET ALL MATCHES SORTED
    // =====================================

    const matches = await Match.find().sort({

      date: 1

    });

    // =====================================
    // FIND CURRENT MATCH
    // =====================================

    const currentIndex = matches.findIndex(

      item =>
      item._id.toString() === req.params.id

    );

    if (currentIndex === -1) {

      return res.json({

        message: "Match not found"

      });

    }

    // =====================================
    // START DATE
    // =====================================

    let nextDate = new Date(date);

    // =====================================
    // UPDATE MATCHES
    // =====================================

    for (

      let i = currentIndex;

      i < matches.length;

      i++

    ) {

      let uniqueDateFound = false;

      while (!uniqueDateFound) {

        // =====================================
        // SKIP WEEKENDS
        // =====================================

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

        // =====================================
        // CHECK DUPLICATE DATE
        // =====================================

        const existingMatch =
        await Match.findOne({

          date: formattedDate,

          _id: {

            $ne: matches[i]._id

          }

        });

        // =====================================
        // IF DATE FREE
        // =====================================

        if (!existingMatch) {

          matches[i].date = formattedDate;

          await matches[i].save();

          uniqueDateFound = true;

        }

        // =====================================
        // IF DATE EXISTS
        // =====================================

        else {

          nextDate.setDate(
            nextDate.getDate() + 1
          );

        }

      }

      // =====================================
      // NEXT DAY
      // =====================================

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