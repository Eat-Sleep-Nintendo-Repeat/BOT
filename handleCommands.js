const { REST } = require('@discordjs/rest');
var Discord = require("discord.js");
const { Routes } = require('discord-api-types/v9');
const {client} = require("./index")
const fs = require("fs")

const config = require("./config.json")


//read all Commandfiles
var commanddir = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
var commands = []


for (const file of commanddir) {

    var commandinfo = require("./commands/" + file).command
    commands.push({
        name: commandinfo.call,
        description: commandinfo.description,
        options: commandinfo.options,
        default_permission: commandinfo.default_permission
    })
    client.commands.set(commandinfo.call, commandinfo);

}
//register commandfiles to database
const rest = new REST({ version: '9' }).setToken(config.discord.bot_token);
(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(
        Routes.applicationGuildCommands(config.discord.client_id, "604747271862485012"),
        { body: commands },
      );
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();

//handle fired commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.user.bot) return;
    if (interaction.channel.type == "DM") return await interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed().setColor(config.colors.error).setDescription("Im sorry. Ich freue mich zwar immer wenn Leute in meine DMs Sliden, aber meine Command funktionieren hier leider nicht :(")]})

    //unknown command triggered
    if (!client.commands.has(interaction.commandName)) {
        await interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed().setColor(config.colors.error).setTitle("Unbekannter Befehl?").setDescription(`Dieser Befehl sollte nicht in eurer Liste sein. Warscheinlich ist es ein alter Befehl der entfernt wurde. Ich werde ihn vorerst aus der Befehlsliste entfernen`)]})
        try {
        await rest.delete(Routes.applicationGuildCommand(config.discord.client_id, "604747271862485012", interaction.id))
        }
        catch (e) {}
    }

    //get command from storage
    try {
        var command = client.commands.get(interaction.commandName)
        if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed().setColor(config.colors.error).setTitle("Fehlende Berechtigung:").setDescription(`Für diesen Befehl benötigst du folgende Permissions:\n${command.permission.map(x => `• ${x}`).join("\n")}`)]})
        command.execute(interaction)
    } catch (error) {
        return await interaction.reply({ephemeral: false, embeds: [new Discord.MessageEmbed().setColor(config.colors.error).setTitle("Ein Fehler ist beim ausführen des Befehls aufgetreten:").setDescription(`${"```"}${error}${"```"}`)]})
    }
  });