const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require("./config.json")

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]})
module.exports.client = client;

client.on('ready', () => {
    console.log(`[DISCORD] Logged in as ${client.user.tag}!`);
    //register commands
    require("./handleCommands")
  });

//Database
require("./database")

//Card Render Engine
require("./webserver/webindex")

//Events
// require("./Events/welcome")
require("./Events/accept_rules")

client.login(config.discord.bot_token)