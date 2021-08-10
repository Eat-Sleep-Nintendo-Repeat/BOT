const { Permissions } = require('discord.js');
exports.command = {
	name: 'clear',
	call: 'clear',
	description: 'Ein Admin Befehl, der es erlaubt mehrere Messages gleichzeitig zu löschen',

    options: [{
        name: "nachrichten-anzahl",
        description: "Anzahl der Nachrichten, die gelöscht werden soll",
        type: 4,
        required: true
    },
    {
        name: "user",
        description: "User von denen aus den letzten X Nachrichten alles gelöscht werden soll",
        type: 6,
        required: false
    }],

    permission: [Permissions.FLAGS.MANAGE_MESSAGES],

	async execute(interaction) {
        const {MessageEmbed} = require("discord.js")
        const config = require("../config.json")
        await interaction.deferReply({ ephemeral: true })

        //fetch all messages from channel
        if (interaction.options.get("nachrichten-anzahl").value > 100) {
            return await interaction.editReply({ephemeral: false, embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("Zu hoher Wert:").setDescription(`Du kannst nur bis zu 100 Messages auf einmal clearen`)]})
        }

        interaction.channel.messages.fetch({"limit": interaction.options.get("nachrichten-anzahl").value, before: interaction.commandiId}).then(messages => {
            
            //check if user argument is given
            if (interaction.options.get("user")) {
                messages = messages.filter(x => x.author.id == interaction.options.get("user").value)
            }

            interaction.channel.bulkDelete(messages, true).then(remmessages => {
                // message.channel.send(embed.success("clear erfolgreich", `Ich habe ${remmessages.size} Messages aus <#${message.channel.id}> gelöscht`)).then(msg => {
                    interaction.editReply({embeds: [new MessageEmbed().setColor(config.colors.success).setTitle("clear erfolgreich").setDescription(`Ich habe ${remmessages.size} Messages aus <#${interaction.channel.id}> gelöscht`)]})
            })
        })
    },
};