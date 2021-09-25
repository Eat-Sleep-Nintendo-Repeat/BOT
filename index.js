const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require("./config.json")
const fs = require("fs")

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]})
module.exports.client = client;

client.on('ready', () => {
    console.log(`[DISCORD] Logged in as ${client.user.tag}!`);
    //register commands
    require("./handleCommands")
  });

//Database
require("./database")

//Events
var commanddir = fs.readdirSync('./Events').filter(file => file.endsWith('.js'));
for (const file of commanddir) {
require("./Events/" + file)
}

client.login(config.discord.bot_token)