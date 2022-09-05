const { nanoid } = require("nanoid");

exports.command = {
  name: "link_nintendo_account",
  call: "link_ninendo",
  description: "Ein Befehl, der es erlaubt seine Nintendo Switch Online App mit unserem Server zu verknüpfen",

  options: [],

  permission: [],

  async execute(interaction) {
    const Discord = require("discord.js");
    const { axios, baseURL } = require("../Modules/api");
    await interaction.deferReply({ ephemeral: true });

    //request surl
    var surl = await axios.get(baseURL + "/nintendo/surl", {
      headers: {
        in_behalf_of: interaction.user.id,
      },
    });

    var MessageInteraction = new Discord.MessageActionRow().addComponents(new Discord.MessageButton({ label: "Ich bin bereit", customId: "link_ninendo_ready", style: "SUCCESS" }));

    await interaction.editReply({ components: [MessageInteraction], embeds: [new Discord.MessageEmbed().setImage("https://media.discordapp.net/attachments/770299663789457409/1016371035957895309/nsohowto.png").setDescription(`Um deinen Nintendo Account mit uns zu verknüpfen müssen folgende Schritte durchgeführt werden:\n\n**Schritt 1:** Rufe die folgende URL in deinem Browser auf: ${surl.data.surl}\n__Beachte, dass der Link nur für dich bestimmt ist!__\n\n**Schritt 2:** Melde dich falls benötigt mit deinen Nintendo Account an. Keine Sorge. Wir erhalten keinen Zugriff auf deine Passwörter oder ähnlich sensible Daten.\n\n**Schritt 3:** Kopiere den Link von dem \`Diese Person auswählen\` Button. (Wie im Bild gezeigt)\n\n**Schritt 4:** Wenn du den Link kopiert hast, dann klicke auf denn "Ich bin bereit" Button unter dieser Nachricht und füge diesen in die Textbox ein.\n__Nicht wundern. Der Link sieht ziemlich ungewöhnlich aus und fängt mit__\`npf71b963c1b7b6d119://auth\`__ an. Das ist normal__`)] });
  },
};
const Discord = require("discord.js");
const { client } = require("../index");
const { axios, baseURL } = require("../Modules/api");

client.on("interactionCreate", async (interactionButton) => {
  if (interactionButton.isButton() && interactionButton.customId.startsWith("link_ninendo_ready")) {
    var modal = new Discord.Modal().setCustomId("link_ninendo_finish").setTitle("Verkünpfe deinen Nintendo Account");
    var rinkinput = new Discord.TextInputComponent().setCustomId("link_ninendo_finish_rink").setLabel("Füge deinen Link hier ein").setStyle("SHORT").setPlaceholder("npf71b963c1b7b6d119://auth#session_state=...").setRequired(true).setMinLength(550).setMaxLength(650);

    var firstActionRow = new Discord.MessageActionRow().addComponents(rinkinput);
    modal.addComponents(firstActionRow);

    await interactionButton.showModal(modal);
  }

  if (interactionButton.isModalSubmit() && interactionButton.customId.startsWith("link_ninendo_finish")) {
    var rink = interactionButton.fields.getTextInputValue("link_ninendo_finish_rink");
    await interactionButton.deferReply();

    //make rink request
    await axios
      .post(
        baseURL + "/nintendo/linkaccount",
        { rink: rink },
        {
          headers: {
            in_behalf_of: interactionButton.user.id,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        interactionButton.editReply({ embeds: [new Discord.MessageEmbed().setColor("RANDOM").setThumbnail(res.data.nintendo_account.imageUri).setTitle("Das hat geklappt!").setDescription(`Der Nintendo Account "${res.data.nintendo_account.name}" ist jetzt mit <@${interactionButton.user.id}> verknüpft!`).setFooter("/link_nintendo Befehl")] });
      })
      .catch((error) => {
        console.log(error);
        interactionButton.editReply("Etwas ist schief gelaufen. Bitte probiere es nochmal. Falls du keine Erfolge hast dann rede mit Dustin_DM");
      });
  }
});
