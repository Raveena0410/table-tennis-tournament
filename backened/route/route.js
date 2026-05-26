const express = require("express");

const Match = require("../model/model");
const Team = require("../model/model1");
const Login = require("../model/model2");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();



// =====================================
// UPDATE MATCH RESULT
// =====================================
// =====================================
// UPDATE MATCH RESULT
// =====================================

router.post("/", async (req, res) => {

  try {

    const { teamA, teamB, set, winner } = req.body;

    // =====================================
    // FIND EXISTING MATCH
    // =====================================

    const existingMatch =
    await Match.findOne({

      teamA,
      teamB

    });

    if (!existingMatch) {

      return res.json({

        message: "Match not found"

      });

    }

    // =====================================
    // UPDATE MATCH
    // =====================================

    existingMatch.set = set;
    existingMatch.winner = winner;

    await existingMatch.save();

    // =====================================
    // COUNT SETS
    // =====================================

    let teamAsetwon = 0;
    let teamBsetwon = 0;

    set.forEach((item) => {

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
    // TEAM A WON
    // =====================================

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

          }

        }

      );

      await Team.findOneAndUpdate(

        { team: teamB },

        {

          $inc: {

            played: 1,
            lost: 1,
            setwon: teamBsetwon,
            setlost: teamAsetwon,

          }

        }

      );

    }

    // =====================================
    // TEAM B WON
    // =====================================

    else if (winner === teamB) {

      await Team.findOneAndUpdate(

        { team: teamB },

        {

          $inc: {

            played: 1,
            won: 1,
            score: 2,
            setwon: teamBsetwon,
            setlost: teamAsetwon,

          }

        }

      );

      await Team.findOneAndUpdate(

        { team: teamA },

        {

          $inc: {

            played: 1,
            lost: 1,
            setwon: teamAsetwon,
            setlost: teamBsetwon,

          }

        }

      );

    }

    // =====================================
    // UPDATE RATIOS
    // =====================================

    const teams = await Team.find();

    for (let item of teams) {

      if (item.setlost === 0) {

        item.ratio = item.setwon;

      }

      else {

        item.ratio =
        (
          item.setwon /
          item.setlost
        ).toFixed(1);

      }

      await item.save();

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

    const t = await Team.find().sort({

      score: -1,
      ratio: -1,

    });

    res.json(t);

  }

  catch (err) {

    console.log(err);

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