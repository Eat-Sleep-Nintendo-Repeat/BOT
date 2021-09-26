const socket = require("./socketio")
const {client} = require("../index")
const config = require("../config.json")
const { MessageEmbed } = require("discord.js")

//post message in log channel
socket.on("log", (data) => {
    var Embed = new MessageEmbed()
    if (data.color){Embed.setColor(data.color)}
    if (data.title){Embed.setTitle(data.title)}
    if (data.description){Embed.setDescription(data.description)}
    if (data.fields){Embed.setFields(data.fields)}
    
    client.channels.cache.get("644283425389412357").send({embeds: [Embed]})
})