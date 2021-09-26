const config = require("../config.json")
const io = require("socket.io-client");

const socket = io(config["eat-sleep-nintendo-repeat-api"].socket_url + `?Authorization=Token ${config["eat-sleep-nintendo-repeat-api"].api_key}`)

socket.on("connect_error", (e) => {
    console.log("[SOCKER.IO] " + e.message)
})

socket.on("connect", () => {
    console.log("[SOCKER.IO] Websocket connection successfull")
    socket.emit("join", {EventGroup: "system"})
})

module.exports = socket;