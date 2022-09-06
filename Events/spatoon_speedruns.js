var { client } = require("../index");
var config = require("../config.json");
var table = require("text-table");
const { nanoid } = require("nanoid");
var schedule = require("node-schedule");
const { axios, baseURL } = require("../Modules/api");
const { MessageEmbed } = require("discord.js");
var Discord = require("discord.js");

var singleplayerstages = [
  {
    id: "1",
    area: "1",
    name: "Die Oktarianer können's nicht lassen!",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798102239322213/unknown.png",
  },
  {
    id: "2",
    area: "1",
    name: "Willkommen in Oktopia!",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798102520332368/unknown.png",
  },
  {
    id: "3",
    area: "1",
    name: "Oktokopter im Abendrot",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798102830723072/unknown.png",
  },
  {
    id: "101",
    area: "1",
    name: "Brotzeit mit Oktoback",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798164675731526/unknown.png",
  },
  {
    id: "4",
    area: "2",
    name: "Oktospeier-Feier",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798103216586882/unknown.png",
  },
  {
    id: "5",
    area: "2",
    name: "Surfen im Oktopark",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798103615057961/unknown.png",
  },
  {
    id: "6",
    area: "2",
    name: "Invasion der Oktozepps",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798104017703002/unknown.png",
  },
  {
    id: "7",
    area: "2",
    name: "Mega-Putz in der Seitengasse",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798104386814002/unknown.png",
  },
  {
    id: "8",
    area: "2",
    name: "Schmonzette voller Schnalz",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798104768483338/unknown.png",
  },
  {
    id: "9",
    area: "2",
    name: "Oktoling-Hinterhalt im Korallenviertel",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798104986595429/unknown.png",
  },
  {
    id: "102",
    area: "2",
    name: "Oktosamurei rollt an",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798165007089724/unknown.png",
  },
  {
    id: "10",
    area: "3",
    name: "Vorbei an der Oktopatrouille",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798105225666590/unknown.png",
  },
  {
    id: "11",
    area: "3",
    name: "Jäger und Gejagte",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798141095366766/unknown.png",
  },
  {
    id: "12",
    area: "3",
    name: "Die Hüpfburg der Oktarianer",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798141359603833/unknown.png",
  },
  {
    id: "13",
    area: "3",
    name: "Drehschalter und tanzende Flächen",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798141690957894/unknown.png",
  },
  {
    id: "14",
    area: "3",
    name: "Parkhaus-Parkour",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798141997129798/unknown.png",
  },
  {
    id: "15",
    area: "3",
    name: "Oktoling-Hinterhalt auf der Buckelwal-Piste",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798142290739230/unknown.png",
  },
  {
    id: "103",
    area: "3",
    name: "Oktopressor wieder am Drücker",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798165351014410/unknown.png",
  },
  {
    id: "16",
    area: "4",
    name: "Intermezzo auf der Bowlingbahn",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798142894706790/unknown.png",
  },
  {
    id: "17",
    area: "4",
    name: "In der Festung der Oktokommandanten",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798143158943864/unknown.png",
  },
  {
    id: "18",
    area: "4",
    name: "Turmhoch überlegen",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798143536439336/unknown.png",
  },
  {
    id: "19",
    area: "4",
    name: "Das Experimentorium",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798143754547220/unknown.png",
  },
  {
    id: "20",
    area: "4",
    name: "Auf und Ab im Propellerland",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798144048140358/unknown.png",
  },
  {
    id: "21",
    area: "4",
    name: "Oktoling-Hinterhalt an den Muränentürmen",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798162809258004/unknown.png",
  },
  {
    id: "104",
    area: "4",
    name: "Oktoplanscher schlägt Wellen",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798212062982304/104.png",
  },
  {
    id: "22",
    area: "5",
    name: "Pfade ins Ungewisse",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798163018977400/unknown.png",
  },
  {
    id: "23",
    area: "5",
    name: "Reise durch die Oktogalaxie",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798163258069042/unknown.png",
  },
  {
    id: "24",
    area: "5",
    name: "Kreuz und quer über dem Meer",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798163497123870/unknown.png",
  },
  {
    id: "25",
    area: "5",
    name: "Verschiebung gen Wahnsinn",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798163723624488/unknown.png",
  },
  {
    id: "26",
    area: "5",
    name: "Unruhige Kugel am Strand",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798163958517810/unknown.png",
  },
  {
    id: "27",
    area: "5",
    name: "Oktoling-Hinterhalt in der Molluskelbude",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798164394717224/unknown.png",
  },
  {
    id: "105",
    area: "5",
    name: "Bomb Rush Blush der Herzen",
    img: "https://media.discordapp.net/attachments/770299663789457409/1016798212331413514/105.png",
  },
];

var weaponemojis = {
  0: { emoji: "1016760813492633681", name: "Heldenwaffe" },
  1: { emoji: "1016760811743612948", name: "Helden-Roller" },
  2: { emoji: "1016760810359496714", name: "Helden-Konzentrator" },
  3: { emoji: "1016760808857948222", name: "Helden-Doppler" },
  4: { emoji: "1016760807385739376", name: "Helden-Pluviator" },
  5: { emoji: "1016760806144233473", name: "Helden-Splattling" },
  6: { emoji: "1016760804684603463", name: "Helden-Blaster" },
  7: { emoji: "1016760803342422046", name: "Helden-Schwapper" },
  8: { emoji: "1016760801748582400", name: "Helden-Pinsel" },
  100: { emoji: "607228015461793806", name: "Nicht bekannt" },
};

//intiger to emoji converter
const intToEmoji = function (int, unicode) {
  var output = "";
  //int to string
  var int = int.toString();
  int.split("").forEach(function (e) {
    // e to emoji
    switch (e) {
      case "1":
        output += `${unicode ? "1️⃣" : ":one:"}`;
        break;
      case "2":
        output += `${unicode ? "2️⃣" : ":two:"}`;
        break;
      case "3":
        output += `${unicode ? "3️⃣" : ":three:"}`;
        break;
      case "4":
        output += `${unicode ? "4️⃣" : ":four:"}`;
        break;
      case "5":
        output += `${unicode ? "5️⃣" : ":five:"}`;
        break;
      case "6":
        output += `${unicode ? "6️⃣" : ":six:"}`;
        break;
      case "7":
        output += `${unicode ? "7️⃣" : ":seven:"}`;
        break;
      case "8":
        output += `${unicode ? "8️⃣" : ":eight:"}`;
        break;
      case "9":
        output += `${unicode ? "9️⃣" : ":nine:"}`;
        break;
      case "0":
        output += `${unicode ? "0️⃣" : ":zero:"}`;
        break;
      default:
        output += e;
        break;
    }
  });

  //
  return output;
};

//RunningEmbed
function RunningEmbed(rundata, memberdata) {
  return {
    content: null,
    embeds: [
      new MessageEmbed()
        .setColor("F5ED5F")
        .setTitle(`Aktueller Speedrun:\nW${rundata.data.area}.LV${rundata.data.stage_id < 100 ? rundata.data.stage_id : client.emojis.cache.get("1015921513846800384")} - ${singleplayerstages.find((x) => x.id === rundata.data.stage_id).name}`)
        .setThumbnail(singleplayerstages.find((x) => x.id === rundata.data.stage_id).img)
        .setDescription(`Eingereichte Speedruns:\n${rundata.data.runs.map((x) => `${intToEmoji(rundata.data.runs.indexOf(x) + 1, false)} - ${memberdata.data.find((y) => x.user === y.id).username}#${memberdata.data.find((y) => x.user === y.id).discriminator} - ${x.time ? require("../Modules/timetamp builder")(x.time * 1000) : "queued"} - ${x.weapon ? client.emojis.cache.get(weaponemojis[x.weapon].emoji) : client.emojis.cache.get(weaponemojis[100].emoji)}`).join("\n")}`)
        .setFooter({ text: `Letztes Update: ${new Date().toLocaleTimeString()} Uhr | Updates im 6 Minuten Intervall` }),
    ],
    components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({ label: "Teilnehmen", emoji: "❇️", customId: "newparticipant", style: "PRIMARY", disabled: memberdata.length <= 50 }), new Discord.MessageButton({ label: "FAQ", url: "https://telegra.ph/Heromode-Speedruns---FAQ-09-05", style: "LINK" }), new Discord.MessageButton({ label: "Nintendo Account verbinden", url: "https://telegra.ph/Wie-verbinde-ich-meinen-Nintendo-Account-mit-dem-Eat-Sleep-Nintendo-Repeat-Bot-09-05", style: "LINK" }))],
  };
}

//InfoEmbed Stageview
function StageEmbed(rundata, memberdata) {
  var tabledata = rundata.data.map((x) => [`W${x.area}.LV${parseInt(x.stage_id) < 100 ? x.stage_id : "-BOSS"}`, `${x.winner.length != 1 ? `${x.winner.length} member` : memberdata.data.find((y) => y.id === x.winner[0]).username}#${memberdata.data.find((y) => y.id === x.winner[0]).discriminator}`, require("../Modules/timetamp builder")(x.time * 1000)]);
  tabledata.unshift(["stage:", "recordholder:", "best time:"]);

  return {
    content: null,
    embeds: [
      new MessageEmbed()
        .setColor("B941DD")
        .setTitle(`Speedruns - Stage Übersicht:`)
        .setDescription("```" + table(tabledata) + "```")
        .setThumbnail("https://media.discordapp.net/attachments/770299663789457409/1015883339632230511/unknown.png?width=740&height=671"),
    ],
    components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({ label: "Zeige member rank", emoji: "🗺️", customId: "show_users" + nanoid(5), style: "SECONDARY" }))],
  };
}

//InfoEmbed Userview
function UserEmbed(rundata, memberdata) {
  var tabledata = rundata.data.winner.map((x) => [rundata.data.winner.indexOf(x) + 1 + ".", `${memberdata.data.find((y) => y.id === x.user).username}#${memberdata.data.find((y) => y.id === x.user).discriminator}`, x.won]);
  tabledata.unshift(["place:", "user:", "runs won:"]);

  return {
    content: null,
    embeds: [
      new MessageEmbed()
        .setColor("B941DD")
        .setTitle(`Speedruns - Beste Member:`)
        .setDescription("```" + table(tabledata) + "```")
        .setThumbnail("https://media.discordapp.net/attachments/770299663789457409/1015883339632230511/unknown.png?width=740&height=671"),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("speedruns_user" + nanoid(5))
          .setPlaceholder("Siehe runs eines bestimmten Members")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions(memberdata.data.map((x) => ({ label: `${x.username}#${x.discriminator}`, value: x.id })))
      ),
      new Discord.MessageActionRow().addComponents(new Discord.MessageButton({ label: "Zeige stage runs", emoji: "🗺️", customId: "show_stages" + nanoid(5), style: "SECONDARY" })),
    ],
  };
}

var message;
var infomessage;

client.once("ready", async () => {
  var fetch_latest_run = schedule.scheduleJob("*/6 * * * *", async function () {
    message = await client.channels.cache.get("1013848707961196544").messages.fetch("1013870278981460009");
    //fetch latest rundata from api
    axios
      .get(baseURL + "/splatnet2/singleplayer/runs/@latest")
      .then(async (res) => {
        //fech users
        var members = await axios.get(baseURL + `/users?ids=0,${res.data.runs.map((x) => x.user).join(",")}`);

        message.edit(RunningEmbed(res, members));
      })
      .catch(async (error) => {
        console.log(error);
        message.edit({ embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("Could not refresh run").setDescription(error.toString())] });
      });
  });

  var create_new_run = schedule.scheduleJob("0 0 * * *", async function () {
    infomessage = await client.channels.cache.get("1013848707961196544").messages.fetch("1013870260023201915");
    message = await client.channels.cache.get("1013848707961196544").messages.fetch("1013870278981460009");
    //create new run
    var newrun = await axios.post(baseURL + "/splatnet2/singleplayer/runs/newrun").then((newrunres) => {
      message.edit(RunningEmbed(newrunres, { data: [] }));

      //update user stats
      axios
        .get(baseURL + "/splatnet2/singleplayer/runs/users")
        .then(async (res) => {
          //fech users
          var members = await axios.get(baseURL + `/users?ids=0,${res.data.participants.map((x) => x.user).join(",")}`);

          infomessage.edit(UserEmbed(res, members));
        })
        .catch(async (error) => {
          console.log(error);
          infomessage.edit({ embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("Could not create new run").setDescription(error.toString())] });
        });
    });
  });
});

client.on("interactionCreate", async (interaction) => {
  //check if interaction is a

  if (interaction.isButton() && interaction.customId.startsWith("newparticipant")) {
    axios
      .post(
        baseURL + "/splatnet2/singleplayer/runs/NP",
        {},
        {
          headers: {
            in_behalf_of: interaction.user.id,
          },
        }
      )
      .then(async (res) => {
        var members = await axios.get(baseURL + `/users?ids=0,${res.data.runs.map((x) => x.user).join(",")}`);

        res.data.runs.sort((a, b) => a.time - b.time);

        interaction.update(RunningEmbed(res, members));
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message.startsWith("Member is already participating in this run")) {
          interaction.reply({ content: "Du nimmst bereits an diesem Run teil", ephemeral: true });
        } else if (error.response && error.response.data && error.response.data.message.startsWith("Member has no Nintendo Account linked")) {
          interaction.reply({ content: "Du hast deinen Nintendo Account nicht mit uns verknüpft. Um deine Zeiten automatisch zu Importieren ist dies Notwenig", ephemeral: true });
        } else console.log(error);
      });
  }
  if (interaction.isButton() && interaction.customId.startsWith("show_stages")) {
    axios
      .get(baseURL + "/splatnet2/singleplayer/runs/stages")
      .then(async (res) => {
        //get members / filters ids to be uniqece
        var members = await axios.get(baseURL + `/users?ids=0,${Array.from(new Set(res.data.filter((x) => x.winner.length === 1).map((x) => x.winner[0]))).join(",")}`);

        interaction.update(StageEmbed(res, members));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (interaction.isButton() && interaction.customId.startsWith("show_users")) {
    infomessage = await client.channels.cache.get("1013848707961196544").messages.fetch("1013870260023201915");
    axios
      .get(baseURL + "/splatnet2/singleplayer/runs/users")
      .then(async (res) => {
        //fech users
        var members = await axios.get(baseURL + `/users?ids=0,${res.data.participants.map((x) => x.user).join(",")}`);

        interaction.update(UserEmbed(res, members));
      })
      .catch(async (error) => {
        console.log(error);
        infomessage.edit({ embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("Could not create new run").setDescription(error.toString())] });
      });
  }
  if (interaction.isSelectMenu() && interaction.customId.startsWith("speedruns_user")) {
    //fetch user levels
    axios
      .get(baseURL + "/splatnet2/singleplayer/runs/users/" + interaction.values[0])
      .then(async (res) => {
        //fech users
        var member = await axios.get(baseURL + `/users/${interaction.values[0]}`);

        console.log(res.data);

        var tabledata = res.data.map((x) => [`W${x.area}.LV${parseInt(x.stage_id) < 100 ? x.stage_id : "-BOSS"}`, require("../Modules/timetamp builder")(x.time * 1000), weaponemojis[x.weapon].name]);
        tabledata.unshift(["stage:", "time:", "weapon:"]);

        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setThumbnail(member.data.avatar)
              .setTitle(`Die schnellsten Runs von ${member.data.username}`)
              .setDescription(`${res.data.length != 0 ? "```" + table(tabledata) + "```" : "keine daten"}`),
          ],
          ephemeral: true,
        });
      })
      .catch(async (error) => {
        console.log(error);
      });
  }
});
