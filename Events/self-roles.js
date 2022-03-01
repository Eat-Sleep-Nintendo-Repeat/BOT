const { client } = require("../index");
const config = require("../config.json")
const {axios, baseURL} = require("../Modules/api");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const SELF_ROLE = require("../Models/SELF-ROLE");


async function generateembed() {
    //fetch roles
    var self_roles = await SELF_ROLE.find();

    var messageembed = new MessageEmbed().setColor("36FF72").setTitle("Rollen die du dir selbst geben kannst!").setDescription("Wähle ein Spiele oder Themen die dich interessieren, um zugang zu exklusiven Kanälen zu diesen Thema zu bekommen!")
    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("selfrole")
        .setPlaceholder("Wähle eine Rolle")
        .setMaxValues(1)
        .setMinValues(1)
    )

    self_roles.forEach(rdb => {
        var emoji   = client.emojis.cache.get(rdb.emoji)


        messageembed.addField(`${emoji} - ${rdb.name}`, rdb.description, true)
        row.components[0].addOptions([
            {
                label: rdb.name,
                value: rdb.id,
                emoji: emoji
            }
        ])

    })
    return {embeds: [messageembed], components: [row]}
}


//create message on startup
client.on("ready", async () => {
    client.channels.cache.get("948285697394110484").messages.fetch("948324051649171568").then(async m => {
        m.edit(await generateembed())
    })
})

//add or remove role
client.on("interactionCreate", async interaction => {

	if (interaction.customId === 'selfrole') {
        //fetch role from db
        var roledb = await SELF_ROLE.findOne({id: interaction.values[0]})

        var role = interaction.guild.roles.cache.get(roledb.role);

        //remove or add?
        interaction.member.fetch().then(async m => {
            if (m.roles.cache.find(x => x.id === role.id)) {
                await interaction.member.roles.remove(role)
            }
            else {
                await interaction.member.roles.add(role)
            }
        })


        await interaction.update(await generateembed())
	}
});