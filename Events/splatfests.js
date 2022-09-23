var { client } = require("../index");
var schedule = require("node-schedule");
const { axios, baseURL } = require("../Modules/api");
const { MessageEmbed } = require("discord.js");
var Discord = require("discord.js");
var SPLATFESTS = require("../Models/SPLATFEST");
var MEMBER = require("../Models/MEMBER");
const { clearCustomQueryHandlers } = require("puppeteer");

function toRgb(color) {
  return [color.r * 255, color.g * 255, color.b * 255];
}

//check splatfest data
var check_for_splatfests = schedule.scheduleJob("0 * * * *", async function () {
  axios.get(baseURL + "/splatnet3/splatfests").then(async (res) => {
    //check if id is the last one i have i database
    var splatfetstdb = await SPLATFESTS.findOne({ id: res.data[0].id });

    var splatfestdataextendet = await axios.get(baseURL + "/splatnet3/splatfests/" + res.data[0].id);

    var canUseIcons = client.guilds.cache.get("585511241628516352").premiumTier === "TIER_2";

    //the akutell splatfest is a new splatfest
    if (!splatfetstdb) {
      //create splatfest roles
      var role1 = await client.guilds.cache.get("585511241628516352").roles.create({
        name: `Team ${splatfestdataextendet.data.teams[0].teamName}`,
        color: toRgb(splatfestdataextendet.data.teams[0].color),
        icon: canUseIcons ? splatfestdataextendet.data.teams[0].image.url : null,
        position: 17,
      });

      var role2 = await client.guilds.cache.get("585511241628516352").roles.create({
        name: `Team ${splatfestdataextendet.data.teams[1].teamName}`,
        color: toRgb(splatfestdataextendet.data.teams[1].color),
        icon: canUseIcons ? splatfestdataextendet.data.teams[1].image.url : null,
        position: 17,
      });

      var role3 = await client.guilds.cache.get("585511241628516352").roles.create({
        name: `Team ${splatfestdataextendet.data.teams[2].teamName}`,
        color: toRgb(splatfestdataextendet.data.teams[2].color),
        icon: canUseIcons ? splatfestdataextendet.data.teams[2].image.url : null,
        position: 17,
      });

      //make announcment
      var message = await client.channels.cache.get("586177035278483466").send({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("EIN NEUES SPLATFEST WURDE ANGEKÜNDIGT")
            .setDescription(`Ein neues Splatfest steht bevor! Es findet vom <t:${Math.floor(Date.parse(res.data[0].startTime) / 1000)}:F> bis zum <t:${Math.floor(Date.parse(res.data[0].endTime) / 1000)}:F> statt\n\n**${res.data[0].title}**\n<@&${role1.id}>\n<@&${role2.id}>\n<@&${role3.id}>`)
            .setImage(res.data[0].image)
            .setThumbnail("https://cdn.discordapp.com/attachments/770299663789457409/1022922019962097674/Zeichenflache_14x.png")
            .setFooter("Wenn du deinen Nintendo Account verknüpft hast, wird dir automatisch eine Team Rolle zugeteilt sobald du in Splatoon 3 gewählt hast."),
        ],
        content: "<@&948289316055027743>",
        components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({ label: "FAQ - Nintendo Account verbinden?", url: "https://telegra.ph/Wie-verbinde-ich-meinen-Nintendo-Account-mit-dem-Eat-Sleep-Nintendo-Repeat-Bot-09-05", style: "LINK" }))],
      });

      await new SPLATFESTS({
        id: res.data[0].id,
        message: message.id,
        teamroles: [
          { teamid: splatfestdataextendet.data.teams[0].id, main: role1.id },
          { teamid: splatfestdataextendet.data.teams[1].id, main: role2.id },
          { teamid: splatfestdataextendet.data.teams[2].id, main: role3.id },
        ],
      }).save();
    } else {
      splatfestdataextendet.data.teams.forEach((team) => {
        team.dcvotes.forEach((memberid) => {
          //check if member has already been trackedes
          if (!splatfetstdb.players.find((x) => x.id === memberid)) {
            //give role
            var roleid = splatfetstdb.teamroles.find((x) => x.teamid === team.id).main;
            client.guilds.cache.get("585511241628516352").members.cache.get(memberid).roles.add(roleid);

            //add to playerbukket
            splatfetstdb.players.push({
              id: memberid,
              team: team.id,
              cloud: 0,
              rank: null,
            });
          }
        });
      });

      //// IF DATABASE IS SCHEDULED BUT NINTENDO IS AT DAY1
      //
      //Create a Splatfest smart Talk --> Erstellt einen Talk der nur vom eigenen Splatfestteam betreten werden kann.
      //Creates a Splatfest News Chat --> Postet zwischen Ergebnisse und x10 / x100 / x333 Kämpfe und Splatfestrank aufstiege
      //
      //
      //checks for x10 / x100 and x333 Battles
      //checks for Splatfestrank aufstiege
      //collects highest cloud of player
      //
      ////IF DATABASE IS DAY1 BUT NINTENDO IS AT DAY2
      //
      //Posts halvetime best Splatfest Team
      //Posts Member with highest Cloud of Each Team
      //
      //checks for x10 / x100 and x333 Battles
      //checks for Splatfestrank aufstiege
      //collects highest cloud of player
      //
      ////IF DATABASE IS DAY2 BUT NINTENDO IS AT RESULT CALCULATION
      //Delete Splatfest Smarttalk
      //Post Message that says that results are beeing calculated
      //
      ////IF DATABASE SAYs RESULTCALCULATION BUT NINTENDO IS AT END OF SPLATFEST
      //Delete Splatfest News chat and Post Results and Cloudranklist

      await splatfetstdb.save();
    }
  });
});
