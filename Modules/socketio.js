const config = require("../config.json")
const io = require("socket.io-client");

const socket = io(config["eat-sleep-nintendo-repeat-api"].socket_url + `?Authentication=Token ${config["eat-sleep-nintendo-repeat-api"].api_key}`, {
    secure: false,
    path: "/api/socketio"
})

socket.on("connect_error", (e) => {
    // console.log(e)
    console.log("[SOCKET.IO] " + e.message)
})

socket.on("connect", () => {
    console.log("[SOCKET.IO] Websocket connection successfull")
    socket.emit("join", {EventGroup: "system"})
})

module.exports = socket;