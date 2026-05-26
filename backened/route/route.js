const express = require("express");

const Match = require("../model/model");

const Team = require("../model/model1");

const Login = require("../model/model2");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const router = express.Router();

// =====================================
// ADD MATCH RESULT
// =====================================

router.post("/", async (req, res) => {
  try {
    await Match.create(req.body);

    const { teamA, teamB, set, winner } = req.body;

    let teamAsetwon = 0;

    let teamBsetwon = 0;

    set.forEach((item) => {
      if (item.teamA_set > item.teamB_set) {
        teamAsetwon++;
      } else {
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

        { upsert: true, new: true },
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

        { upsert: true, new: true },
      );
    } else {
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

        { upsert: true, new: true },
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

        { upsert: true, new: true },
      );
    }

    const teams = await Team.find();

    for (let item of teams) {
      if (item.setlost === 0) {
        item.ratio = item.setwon;
      } else {
        item.ratio = item.setwon / item.setlost;
      }

      await item.save();
    }

    res.json({
      message: "Data saved successfully",
    });
  } catch (err) {
    console.log(err);
  }
});


// LEADERBOARD


router.get("/lead", async (req, res) => {
  try {
    const t = await Team.find().sort({
      score: -1,
      ratio: -1,
    });

    res.json(t);
  } catch (err) {
    console.log(err);
  }
});


// SIGNUP

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new Login({
      email,
      password: hashpassword,
    });

    await user.save();

    res.json({
      message: "register successfully",
    });
  } catch (err) {
    res.json({
      message: "user is not registered",
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

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        message: "incorrect password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },

      "secret-",

      { expiresIn: "1h" },
    );
    res.json({
      message: "login successfully",
      token,
    });

    
  } catch (err) {
    console.log(err);
  }
});

// GET ALL MATCHES

router.get("/", async (req, res) => {
  const p = await Match.find();

  res.json(p);
});

// ADD TEAM + GENERATE MATCHES
router.put("/reschedule/:id", async (req, res) => {

  try {

    const { date } = req.body;

    // GET ALL MATCHES SORTED
    const matches = await Match.find().sort({
      date: 1
    });

    // FIND CURRENT MATCH INDEX
    const currentIndex = matches.findIndex(
      item => item._id.toString() === req.params.id
    );

    if (currentIndex === -1) {

      return res.json({
        message: "Match not found"
      });

    }

    // START DATE
    let nextDate = new Date(date);

    nextDate.setHours(0,0,0,0);

    // UPDATE CURRENT + NEXT MATCHES
    for (

      let i = currentIndex;

      i < matches.length;

      i++

    ) {

      // SKIP WEEKENDS
      while (

        nextDate.getDay() === 0 ||

        nextDate.getDay() === 6

      ) {

        nextDate.setDate(
          nextDate.getDate() + 1
        );

      }

      // SAVE DATE
      matches[i].date = new Date(nextDate);

      await matches[i].save();

      // NEXT DAY
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

  }

});
module.exports = router;
