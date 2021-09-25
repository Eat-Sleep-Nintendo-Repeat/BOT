const { Permissions } = require('discord.js');
exports.command = {
	name: 'Stream Talk',
	call: 'streamtalk',
	description: 'Ein Admin Befehl, der es erlaubt schnell einen Talk zum Stream Talk umzuwandeln',

    permission: [Permissions.FLAGS.MANAGE_CHANNELS],

	async execute(interaction) {
        const config = require("../config.json")
        await interaction.deferReply({ ephemeral: true })

        if (interaction.member.voice.channel != null){
            interaction.member.voice.channel.setName(interaction.member.voice.channel.name.includes("🔴") ? `${interaction.member.voice.channel.name.replace("🔴", "")}` : `🔴${interaction.member.voice.channel.name}`)
            interaction.editReply("done")
        }
        else {
            interaction.editReply("Bist nicht in nem Talk")
        }
      
    },
};