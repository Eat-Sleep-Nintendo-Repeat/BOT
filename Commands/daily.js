exports.command = {
	name: 'daily',
	call: 'daily',
	description: 'Ein Befehl, der er erlaubt die tägliche Belohnung einzulösen',

    permission: [],

	async execute(interaction) {
        const {MessageEmbed} = require("discord.js")
        const {axios, baseURL} = require("../Modules/api")
        const {client} = require("../index")
        const config = require("../config.json")
        await interaction.deferReply({ ephemeral: false })

        // fetch api for daily
        axios.post(baseURL + `/gems/${interaction.member.id}/daily`).then(res => {
            
            const Gemoji = client.emojis.cache.find(emoji => emoji.id === "912393376769376297");
            interaction.editReply({embeds: [new MessageEmbed().setColor(config.colors.success).setTitle("Daily erfolgreich!").setDescription(`Deine täglichen 150 ${Gemoji} wurden geclaimt`)]})
    
            }).catch(e => {
            if (e.response && e.response.data.message){
                if (e.response.data.tryagain) { //Daily not ready
                    return interaction.editReply({embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("API Error").setDescription(`Du hast deine tägliche Belohnung bereits eingelöst...\nVersuche es am ${new Date(e.response.data.tryagain).toLocaleDateString("DE-de")} um ${new Date(e.response.data.tryagain).toLocaleTimeString("DE-de")} Uhr erneut`)]})
                }
                else { //something went wrong by api
                    return interaction.editReply({embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("API Error").setDescription(e.response.data.message)]})
                }
            }
            else {
                return interaction.editReply({embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("Fetch Error").setDescription(e.message)]})
            }
        })
        
    },
};