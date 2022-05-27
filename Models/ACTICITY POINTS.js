const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  date: { default: new Date(), type: Date },
  member: { type: String, required: true },
  action: { type: String, required: true },
  value: { type: Number, required: true },
  expires: {required: true, type: Date },
});

module.exports = mongoose.model("activitypoints", Schema);
