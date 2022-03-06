var randomWords = require('random-words');
const { client } = require("../index");
const config = require("../config.json")
const {axios, baseURL} = require("../Modules/api");
const { Permissions } = require('discord.js');

//delete all empty channels after reboot
client.on("ready", () => {
    setTimeout(() => {
        client.guilds.cache.get("585511241628516352").channels.cache.get("736589204015808602").children.forEach(v => {
            console.log(v.name)
            if (v.id === "950002659237183508") return;

            if (v.members.toJSON().length === 0) {
                v.delete()
            }
        });
    }, 10000);
})

//talk manager
client.on("voiceStateUpdate", async (oldState, newState) => {
    //channel joined
    if (newState.channel && newState.channel.id === "950002659237183508"){
    
        //create a new channel
        var new_channel = await newState.guild.channels.create(`Talk ${randomWords({exactly:1, wordsPerString:2, separator:'-'})}`, {parent: newState.channel.parent, type: "GUILD_VOICE",
         permissionOverwrites: [
            {
                id: newState.member.id,
                allow: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_ROLES, ],
            },
            {
                id: newState.guild.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK],
            },
        ]})

        //move member to channel
        newState.setChannel(new_channel)

    }

    if (oldState.channel && oldState.channel.parentId === "736589204015808602" && oldState.channel.id != "950002659237183508" && oldState.channel.members.toJSON().length === 0) {
        //check if the old channel is empty
        if (oldState.channel.members.toJSON().length === 0) {
            oldState.channel.delete("Interactive Channel was left alone")
        }
    }
})