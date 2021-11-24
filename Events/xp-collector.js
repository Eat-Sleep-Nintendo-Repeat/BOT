var { client } = require("../index");
var config = require("../config.json");
var MEMBER = require("../Models/MEMBER");
var schedule = require("node-schedule");

//Voicechat xp Collector
var gets_xp_every_minute = schedule.scheduleJob(
  "0 * * * * *",
  async function () {
    //fetch guild
    client.guilds.fetch("585511241628516352");

    //grab every voicestate from the Eat, Sleep, Server from cache
    var vcstate = client.guilds.cache
      .get("585511241628516352")
      .voiceStates.cache.toJSON();

    vcstate.forEach(async state => {
      if (state.channel == null) return; //returns if member isnt in a voice channel
      if (state.selfDeaf) return; //returns if member is deaf
      if (state.selfMute) return; //returns if member is mute

      if (client.guilds.cache.get("585511241628516352").channels.cache.get(state.channelId).members.toJSON().length < 2)
        return; //returns if member is alone in channel
    await MEMBER.findOne({ id: state.id }).then(async memberdb => {
        if (!memberdb) return;
        var needforlevelup = memberdb.currencys.ranks.rank * 5;
        memberdb.currencys.ranks.xp += 1;

        if (memberdb.currencys.ranks.xp >= needforlevelup) {
          //member got an level up
          await MEMBER.findOneAndUpdate({ id: memberdb.id },
            {
              "currencys.ranks.xp": 0,
              "currencys.ranks.rank": memberdb.currencys.ranks.rank + 1,
            });
          if (memberdb.settings.levelup_notify) try {client.users.cache.get(memberdb.id).send(`Du hast soeben Level ${memberdb.currencys.ranks.rank + 1} erreicht!`);} catch {}
        } else {
          await MEMBER.findOneAndUpdate({ id: memberdb.id }, { "currencys.ranks.xp": memberdb.currencys.ranks.xp });
        }
      });
    });
  }
);

//Chat cp Collector
var cooldown = [];
client.on("messageCreate", async msg => {
  if (cooldown.find(x => x === msg.author.id)) return;
  if (msg.content.startsWith(config.prefix)) return;

  await MEMBER.findOne({ id: msg.author.id }).then(async doc => {
    if (!doc) return;

    var needforlevelup = doc.currencys.ranks.rank * 5;
    doc.currencys.ranks.xp += Math.floor(Math.random() * 5) + 1;

    if (doc.currencys.ranks.xp >= needforlevelup) {
      await MEMBER.findOneAndUpdate({ id: doc.id },
        {
          "currencys.ranks.xp": 0,
          "currencys.ranks.rank": doc.currencys.ranks.rank + 1,
        }
      );
      if (doc.settings.levelup_notify) {
        var lvupmessage = await msg.channel.send(`Hey <@${doc.id}>! Glückwunsch zum Level-up auf Stufe ${doc.currencys.ranks.rank + 1}`);
        
        setTimeout(() => {
          lvupmessage.delete();
        }, 15000);
      }
    } else {
      await MEMBER.findOneAndUpdate(
        { id: doc.id },
        { "currencys.ranks.xp": doc.currencys.ranks.xp + 1 }
      );
    }

    cooldown.push(doc.id);
    setTimeout(() => {
      cooldown.shift();
    }, 60000);
  });
});