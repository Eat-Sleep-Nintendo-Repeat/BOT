const { Client, Intents } = require('discord.js');
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
  
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
});

client.login(config.discord.bot_token)