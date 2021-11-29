var schedule = require("node-schedule");
var {client} = require("../index")
var MEMBER = require("../Models/MEMBER")

schedule.scheduleJob("*/30 * * * *", async function () {
    var dbmember = await MEMBER.find({});
    client.guilds.cache.get("585511241628516352").members.cache.forEach(async member => {
        var databasemember = dbmember.find(x => x.id == member.id);
        
  
        //checks if discord data is not the same with database data
        if (databasemember == undefined) {
          //create member data if he isnt in the database
          await new MEMBER({
            id: member.id,
            informations: {
              name: member.user.username,
              discriminator: member.user.discriminator,
              avatar: member.user.avatar,
            },
            type: 0,
          }).save();
          return;
        }
         else if (
          member.user.username != databasemember.informations.name || //check for new username
          member.user.discriminator != databasemember.informations.discriminator || //check for new discriminator
          member.user.avatar != databasemember.informations.avatar || //check for new avatar
          member.roles.cache.has("710475248516071455") != databasemember.serverbooster //check if server boosted state
        ) {          
          await MEMBER.findOneAndUpdate(
            { id: member.id },
            {
              "informations.name": member.user.username,
              "informations.discriminator": member.user.discriminator,
              "informations.avatar": member.user.avatar,
              serverbooster: member.roles.cache.get("710475248516071455") ? true : false,
            }
          );
        }
      });
  });