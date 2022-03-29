const { Permissions } = require('discord.js');
const {client} = require("../index")
exports.command = {
	name: 'evaluate',
	call: 'eval',
	description: 'Ein Admin Befehl, der es erlaubt den Bot einen beliebigen Code evaluieren zu lassen',

    options: [{
        name: "code",
        description: "Der zu evaluierende Code",
        type: 3,
        required: true
    }],

    permission: [Permissions.FLAGS.MANAGE_GUILD],

	async execute(interaction) {
        const message = interaction.message;
        const guild = message.guild;
        const channel = interaction.channel;
        const {MessageEmbed} = require("discord.js")
        const config = require("../config.json")

        if (interaction.member.id != "330380702505762817") return;

        await interaction.deferReply({ ephemeral: true })

        try {
            const code = interaction.options.get("code").value
            let evaled = eval(code);
       
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
       
            await interaction.editReply({embeds: [new MessageEmbed().setTitle("Successfully evaluated").setDescription(`Code\`\`\`js\n${code}\`\`\`Ergebniss\`\`\`xl\n${evaled}\`\`\``).setColor(config.colors.someshit)]})
          } catch (err) {
            await interaction.editReply(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
          }

        
    },
};