const mongoose = require("mongoose")

const Schema = mongoose.Schema({
    id: {type: String, required: true},
    author: String,
    message: String,
    stars: Array,
    date: {type: Date, default: new Date()},

    content: String,
    media: Object,

    starbordmessage: String
})

module.exports = mongoose.model("Starboardet-Message-2", Schema)