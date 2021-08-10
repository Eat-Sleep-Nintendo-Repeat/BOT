var {client} = require("../index")
var MEMBER = require("../Models/MEMBER")
var config = require("../config.json")

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
    if (!interaction.customId == "accept_rules") return;

    await interaction.deferReply({ephemeral: true})

    if (interaction.member.roles.cache.has("585511864931188856"))
    return await interaction.editReply({content: "Du hast die Regeln bereits akzeptiert"});

    var memberdb = await MEMBER.findOne({ id: interaction.user.id });

    if (!memberdb){interaction.member.kick("War nicht in der Database als er die Regeln akzeptieren wollte")}

    interaction.member.roles.add("585511864931188856")

    await MEMBER.findOneAndUpdate({ id: interaction.member.id }, { type: 1 }).then(async () => {
        await interaction.editReply({content: "Du hast erfolgreich die Regeln akzeptiert. Viel Spaß! ^^"})
      });

})