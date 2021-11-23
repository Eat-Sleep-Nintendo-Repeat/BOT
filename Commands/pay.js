exports.command = {
	name: 'pay gems',
	call: 'pay',
	description: 'Ein Befehl, der einem anderen Member gems überträgt',

    options: [
    {
        name: "user",
        description: "Dem Member dem die Gems übertragen werden sollen",
        type: 6,
        required: true
    },

    {
        name: "anzahl",
        description: "Die Anzahl der Gems die übertragen werden sollen",
        type: 4,
        required: true
    },
],

    permission: [],

	async execute(interaction) {
        const {MessageEmbed} = require("discord.js")
        const {axios, baseURL} = require("../Modules/api")
        const {client} = require("../index")
        const config = require("../config.json")
        await interaction.deferReply({ ephemeral: false })

            gettingpayedm = interaction.options.get("user").value,
            amount = interaction.options.get("anzahl").value
        

            axios.put(baseURL + `/gems/${interaction.member.id}`, {receiver: gettingpayedm, amount: amount}).then(res => {
                //transfer successfull
                var embeds = []
                const Gemoji = client.emojis.cache.find(emoji => emoji.name === "EatSleepGem");
                embeds.push(new MessageEmbed().setColor(config.colors.success).setTitle("Transfer erfolgreich").setDescription(`Deine ${amount}${Gemoji} wurden erfolgreich zu <@${gettingpayedm}> übertragen!`))
                if (amount == 69 || amount == 420) embeds.push(new MessageEmbed().setColor(config.colors.someshit).setTitle(`${amount}`).setDescription(`Hehe nice`))
                interaction.editReply({embeds: embeds})
            }).catch(e => {
                if (e.response && e.response.data.message){
                    return interaction.editReply({embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("API Error").setDescription(e.response.data.message)]})
                }
                else {
                    return interaction.editReply({embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("Fetch Error").setDescription(e.message)]})
                }
            })

    }
}