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
var check_for_splatfests = schedule.scheduleJob("*/15 * * * *", async function () {
  // client.on("ready", () => {
  axios.get(baseURL + "/splatnet3/splatfests").then(async (res) => {
    if (!res.data) {
      console.log("Error while fetching Splatfestdata basic");
      return;
    }
    axios.post(baseURL + "/splatnet3/dev", { name: `${res.data[0].state}` });

    //check if id is the last one i have i database
    var splatfetstdb = await SPLATFESTS.findOne({ id: res.data[0].id });

    var splatfestdataextendet = await axios.get(baseURL + "/splatnet3/splatfests/" + res.data[0].id);

    if (!splatfestdataextendet.data) {
      console.log("Error while fetching Splatfestdata extendet");
      return;
    }

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
      var promises = [];
      //give everyone splatfest roles
      if (splatfetstdb.state === "SCHEDULED" || splatfetstdb.state === "FIRST_HALF" || splatfestdataextendet.data.state === "SECOND_HALF") {
        splatfestdataextendet.data.teams.forEach((team) => {
          team.dcvotes.forEach((memberid) => {
            //check if member has already been tracked
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
      }

      //fetch battles and rankups while fights are open
      if (splatfestdataextendet.data.state === "FIRST_HALF" || splatfestdataextendet.data.state === "SECOND_HALF") {
        //Check Splatfestrank changes
        //Check for X Battles
        splatfetstdb.players.forEach(async (p, index) => {
          promises.push(
            new Promise(async (resolveBoth, rejectBoth) => {
              try {
                //fetch latest battles of player
                var playerRecentBattles = await axios.get(baseURL + "/splatnet3/player/recentBattles", { headers: { in_behalf_of: p.id } });

                var ownpromieses = [];

                //CHECK SPLATFESTRANK
                ownpromieses.push(
                  new Promise((resolve, reject) => {
                    //check if latest battle was splatfest
                    if (!playerRecentBattles.data.historyGroups.nodes[0].historyDetails.nodes[0].vsMode.mode === "FEST") return resolve();
                    var rank = playerRecentBattles.data.historyGroups.nodes[0].historyDetails.nodes[0].player.festGrade;

                    //ckeck if rank has changed
                    if (p.rank === rank) return resolve();

                    //Send message if old rank is not null
                    if (p.rank != null) {
                      client.channels.cache.get(splatfetstdb.channel).send({
                        embeds: [new MessageEmbed().setColor(toRgb(splatfestdataextendet.data.teams.find((y) => y.id === p.team).color)).setDescription(`<@${p.id}> ist zum **${rank}** aufgestiegen`)],
                      });
                    }
                    splatfetstdb.players[index].rank = rank;
                    resolve();
                  })
                );

                Promise.all(ownpromieses).then(() => {
                  resolveBoth();
                });
              } catch (error) {
                console.log(error);
                resolveBoth();
              }
            })
          );
        });
      }

      //If splatfest has started
      if (splatfetstdb.state === "SCHEDULED" && splatfestdataextendet.data.state === "FIRST_HALF") {
        splatfetstdb.state = splatfestdataextendet.data.state;
        await client.guilds.cache
          .get("585511241628516352")
          .channels.create("splatfest-chat", {
            type: "GUILD_TEXT",
            parent: "585523787408212079",
            position: 1,
            permissionOverwrites: client.guilds.cache.get("585511241628516352").channels.cache.get("585516580532781089").permissionOverwrites.cache,
          })
          .then(async (channel) => {
            splatfetstdb.channel = channel.id;
            await channel.send({
              embeds: [new MessageEmbed().setColor("RANDOM").setTitle("Das Splatfest beginnt!").setDescription(`Das Splatfest hat offiziell begonnen!`).setImage(res.data[0].image).setThumbnail("https://cdn.discordapp.com/attachments/770299663789457409/1022922019962097674/Zeichenflache_14x.png").setFooter("Wenn du deinen Nintendo Account verknüpft hast, Werden in diesem Channel automaisch deine Splatfest Erfolge verzeichnet!")],
              content: "<@&948289316055027743>",
              components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({ label: "FAQ - Nintendo Account verbinden?", url: "https://telegra.ph/Wie-verbinde-ich-meinen-Nintendo-Account-mit-dem-Eat-Sleep-Nintendo-Repeat-Bot-09-05", style: "LINK" }))],
            });
          });

        //checks for x10 / x100 and x333 Battles
        //checks for Splatfestrank aufstiege
        //
        ////IF DATABASE IS DAY1 BUT NINTENDO IS AT DAY2
        //
        //Posts halvetime best Splatfest Team
        //
        ////IF DATABASE IS DAY2 BUT NINTENDO IS AT RESULT CALCULATION
        //Delete Splatfest Smarttalk
        //Post Message that says that results are beeing calculated
        //
        ////IF DATABASE SAYs RESULTCALCULATION BUT NINTENDO IS AT END OF SPLATFEST
        //Delete Splatfest News chat and Post Results and Cloudranklist
      }

      //If first halve of Splatfest is over
      if (splatfetstdb.state === "FIRST_HALF" && splatfestdataextendet.data.state === "SECOND_HALF") {
        splatfetstdb.state = splatfestdataextendet.data.state;
        var defenserole = splatfetstdb.teamroles.find((x) => x.teamid === splatfestdataextendet.data.teams.find((y) => y.role === "DEFENSE").id).main;

        client.channels.cache.get(splatfetstdb.channel).send({
          embeds: [
            new MessageEmbed()
              .setColor(toRgb(splatfestdataextendet.data.teams.find((y) => y.role === "DEFENSE").color))
              .setTitle("SPLATFEST HALBZEIT!")
              .setDescription(`Die erste Hälfte des Splatfests ist vorbei! Das heißt es ist Tricolor Time!\n<@&${defenserole}> steht bis jetzt am besten da und muss sich gegen die anderen Teams verteidigen.\n\nViel Glück!`)
              .setImage(res.data[0].image)
              .setThumbnail(splatfestdataextendet.data.teams.find((y) => y.role === "DEFENSE").image.url),
          ],
          content: "<@&948289316055027743>",
          components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({ label: "FAQ - Nintendo Account verbinden?", url: "https://telegra.ph/Wie-verbinde-ich-meinen-Nintendo-Account-mit-dem-Eat-Sleep-Nintendo-Repeat-Bot-09-05", style: "LINK" }))],
        });
      }

      //DEV SHIT
      if (splatfetstdb.state === "SECOND_HALF" && splatfestdataextendet.data.state != "SECOND_HALF") {
        splatfetstdb.state = splatfestdataextendet.data.state;

        client.channels.cache.get(splatfetstdb.channel).send({
          embeds: [new MessageEmbed().setColor("RANDOM").setTitle("SPLATFEST ENDE").setDescription(`Und damit ist das Splatfest beendet! Die Splafestrollen und dieser Channel sollten eigentlich nach dem Splatfest automatisch gelöscht werden. Da Dustin allerdings nicht weiß wie die Splatfest Daten von den Nintendo Servern nach einem Splatfest aussehen und er sich das dann erst nach der Arbeit anschauen kann, bleiben diese Dinge bis dahin erstmal.`).setImage(res.data[0].image)],
        });
      }

      Promise.all(promises).then(async () => {
        await splatfetstdb.save();
      });
    }
  });
});
