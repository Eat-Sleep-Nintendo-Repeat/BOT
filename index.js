process.env.TZ = 'Europe/Berlin';

const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require("./config.json")
const fs = require("fs")
const { Manager } = require("@lavacord/discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  retryLimit: 5
})
module.exports.client = client;

//Lavacord
const manager = new Manager(client, config.lavacord.nodes);
module.exports.musicmanager = manager;

client.on('ready', async () => {

  await manager.connect();
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`[DISCORD] Logged in as ${client.user.tag}!`);
  //register commands
  require("./handleCommands")
  
});

//Database
require("./database")

//Socket
require("./Modules/socketio")
require("./Modules/socket events")

//Events
var commanddir = fs.readdirSync('./Events').filter(file => file.endsWith('.js'));
for (const file of commanddir) {
require("./Events/" + file)
}

client.login(config.discord.bot_token);