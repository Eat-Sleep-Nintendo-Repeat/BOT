const Mongoose = require("mongoose");
const config = require("./config.json");

Mongoose.connect(config.database.login_creds, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).catch(err => console.log(err));

Mongoose.connection.on("connecting", () => {
    console.log("[MONGOOSE] connecting to server...")
})

Mongoose.connection.once("connected", () => {
    console.log("[MONGOOSE] successfully connected to server")
})

Mongoose.connection.on("disconnected", () => {
    console.log("[MONGOOSE] lost connection to server")
})

Mongoose.connection.on("reconnected", () => {
    console.log("[MONGOOSE] reconnected to server")
})