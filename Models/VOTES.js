const mongoose = require("mongoose")

const Schema = mongoose.Schema({
    question: {type: String, required: true},
    answers: {type: Array, required: true}, // {answer: String, votes: Number, order: Number}} 

    minvotes: {type: Number, default: 1},
    maxvotes: {type: Number, default: 1},

    voted_users: [{
        id: String
    }],

    message: {type: String},
    channel: {type: String},

    createdAt: {type: Date, default: Date.now()},
    closingAt: Date
})

module.exports = mongoose.model("vote", Schema)