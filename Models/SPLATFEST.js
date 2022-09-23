const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  id: { type: String, required: true },
  state: { type: String, default: "SCHEDULED" },
  players: { type: Array, default: [] },
  message: { type: String, required: true },
  talk: { type: String, default: null },
  fights: { type: Array, default: [] },
  teamroles: [
    {
      teamid: { type: String, required: true },
      main: { type: String, required: true },
      fight100: { type: String, default: null },
      fight333: { type: String, default: null },
    },
    {
      teamid: { type: String, required: true },
      main: { type: String, required: true },
      fight100: { type: String, default: null },
      fight333: { type: String, default: null },
    },
    {
      teamid: { type: String, required: true },
      main: { type: String, required: true },
      fight100: { type: String, default: null },
      fight333: { type: String, default: null },
    },
  ],
});

module.exports = mongoose.model("Splatfests", Schema);
