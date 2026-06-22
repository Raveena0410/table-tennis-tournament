const mongoose = require('mongoose')

const teamschema = new mongoose.Schema({

    team: {
        type: String,
        required: true
    },

    member1: {
        type: String
    },

    member2: {
        type: String
    },

    played: {
        type: Number,
        default: 0
    },

    won: {
        type: Number,
        default: 0
    },

    lost: {
        type: Number,
        default: 0
    },

    setwon: {
        type: Number,
        default: 0
    },

    setlost: {
        type: Number,
        default: 0
    },

    ratio: {
        type: Number,
        default: 0
    },

    score: {
        type: Number,
        default: 0
    }

})

// const team = mongoose.model("team", teamschema)

// module.exports = team
