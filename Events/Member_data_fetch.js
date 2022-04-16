var schedule = require("node-schedule");
var {client} = require("../index")
var MEMBER = require("../Models/MEMBER")
var IMAGE_STORE = require("../Models/IMAGESTORE");
var fetch = require("node-fetch");
const { nanoid } = require("nanoid");

schedule.scheduleJob("*/30 * * * *", async function () {
    var dbmember = await MEMBER.find({});
    client.guilds.cache.get("585511241628516352").members.cache.forEach(async member => {
        var databasemember = dbmember.find(x => x.id == member.id);

        //add profile picture to image store
        if (member.user.avatar != null) {
            var image = await IMAGE_STORE.findOne({ type: "avatar", belong_to: member.id });

            //fetch avatar and save it to buffer
            var buffer = await fetch(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })).then(res => res.buffer());

            if (!image) {
              //save image buffer to image store
              var imagenew = new IMAGE_STORE({
                type: "avatar",
                filename: member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }).split("/").pop(),
                id: nanoid(20),
                belong_to: member.id,
                image: buffer,
                date: new Date(),
              });
              await imagenew.save();
            } 
            else {
              //update image buffer to image store
              image.image = buffer;
              image.filename = member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }).split("/").pop();
              image.date = new Date();
              await image.save();
            }

        
  
        //checks if discord data is not the same with database data
        if (databasemember == undefined) {
          //create member data if he isnt in the database
          await new MEMBER({
            id: member.id,
            informations: {
              name: member.user.username,
              discriminator: member.user.discriminator,
              avatar: member.user.displayAvatarURL(),
            },
            type: 0,
          }).save();
          return;
        }
         else if (
          member.user.username != databasemember.informations.name || //check for new username
          member.user.discriminator != databasemember.informations.discriminator || //check for new discriminator
          member.roles.cache.has("710475248516071455") != databasemember.serverbooster //check if server boosted state
        ) {          
          await MEMBER.findOneAndUpdate(
            { id: member.id },
            {
              "informations.name": member.user.username,
              "informations.discriminator": member.user.discriminator,
              "informations.avatar": member.user.avatar != null ? `https://eat-sleep-nintendo-repeat.eu/api/imagestore/${image.id}` : null,
              serverbooster: member.roles.cache.get("710475248516071455") ? true : false,
            }
          );
        }
      }});
  });