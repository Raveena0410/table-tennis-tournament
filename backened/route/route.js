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
  } catch (err) {
    console.log(err);
  }
});

// =====================================
// SIGNUP
// =====================================

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

router.post("/addteam", async (req, res) => {
  try {
    const newTeam = new Team(req.body);

    await newTeam.save();

    // DELETE OLD MATCHES
    await Match.deleteMany();

    // GET ALL TEAMS
    const teams = await Team.find().sort({
      team: 1,
    });

    let matches = [];

    let currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const matchDate = new Date(currentDate);

        matchDate.setHours(0, 0, 0, 0);

        matches.push({
          teamA: teams[i].team,

          teamB: teams[j].team,

          winner: "",

          set: [],

          date: matchDate,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // SAVE MATCHES
    await Match.insertMany(matches);

    res.json({
      message: "Team Added And Matches Generated",
    });
  } catch (err) {
    console.log(err);
  }
});

// GET ALL TEAMS

router.get("/teams", async (req, res) => {
  const data = await Team.find();

  res.json(data);
});

// GET SORTED MATCHES

router.get("/matches", async (req, res) => {
  try {
    const data = await Match.find().sort({
      date: 1,
    });

    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

// RESCHEDULE MATCH

router.put("/reschedule/:id", async (req, res) => {
  try {
    const { date } = req.body;

    const currentMatch = await Match.findById(req.params.id);

    const oldDate = new Date(currentMatch.date);

    const selectedDate = new Date(date);

    selectedDate.setHours(0, 0, 0, 0);

    currentMatch.date = selectedDate;

    await currentMatch.save();

    const nextMatches = await Match.find({
      date: { $gt: oldDate },

      _id: { $ne: currentMatch._id },
    }).sort({
      date: 1,
    });

    let nextDate = new Date(selectedDate);

    for (let item of nextMatches) {
      do {
        nextDate.setDate(nextDate.getDate() + 1);
      } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);

      item.date = new Date(nextDate);

      await item.save();
    }

    res.json({
      message: "Match Rescheduled Successfully",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
