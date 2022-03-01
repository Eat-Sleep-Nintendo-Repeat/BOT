const mongoose = require("mongoose")

const Schema = mongoose.Schema({
	name: String,
    id: String,
    role: String,
    emoji: String,
    description: String
})

module.exports = mongoose.model("self-role", Schema)