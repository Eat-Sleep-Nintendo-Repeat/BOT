const mongoose = require("mongoose");

const MemberSchema = mongoose.Schema({
  id: { required: true, type: String },
  informations: { name: String, discriminator: String, avatar: String },
  type: { default: 0, type: Number },
  serverbooster: { default: false, type: Boolean },

  currencys: {
    ranks: {
      rank: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
      notify: { type: Boolean, default: false },
    },
    coins: {
      amount: { type: Number, default: 300 },
      log: Array,
      purchases: [
        {
          id: Number,
          date: { type: Date, default: new Date() },
          active: { type: Boolean, default: true },
        },
      ],
      last_daily: { type: Date, default: null },
    },
  },
  
  statistics: {},
  oauth: {
    access_token: { default: null, type: String },
    refresh_token: String,
    expire_date: Date,
    scopes: Array,
    redirect: String,
    cookies: Array,
    blocking_state: {
      is_blocked: { type: Boolean, default: false },
      date: Date,
      reason: String,
    },
  },

  usemyvoice: {
    accepted: { type: Boolean, default: false },
    date: Date,
    signature: String,
  },

  delete_in: { default: null, type: Date },
  joined: { default: new Date(), type: Date },
});

module.exports = mongoose.model("Member-v2.0", MemberSchema);
