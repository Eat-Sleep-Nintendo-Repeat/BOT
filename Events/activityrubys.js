const { MessageReaction } = require("discord.js");
const { client } = require("../index");
const ACTIVITY_DATA = require("../Models/ACTICITY GEMS.js");

function lastDayOfMonthDate() {
    const date = new Date();
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23)
    lastDayOfMonth.setMinutes(59)
    lastDayOfMonth.setSeconds(59)
    lastDayOfMonth.setMilliseconds(999)

    return lastDayOfMonth;
}

var messageListener = [];
client.on("messageCreate", async (message) => {
    //check if the message is from a bot
    if (message.author.bot) return;

    var member = messageListener.find(m => m.member == message.author.id);
    if (!member) {
        messageListener.push({ member: message.author.id, count: 1, lastMessage: message.createdAt });

        savetodb()
        function savetodb() {
            setTimeout(async () => {
                if (!messageListener.find(m => m.member == message.author.id)) return;

                //check if last message is older then 5 minutes
                if (messageListener.find(m => m.member == message.author.id).lastMessage < new Date(Date.now() - (50 * 60 * 1000))) {
                    //save to db
                    await new ACTIVITY_DATA({
                        date: new Date(),
                        member: message.author.id,
                        action: "message",
                        value: messageListener.find(m => m.member == message.author.id).count,
                        expires: lastDayOfMonthDate()
                    }).save();
                    //rmeove from array
                    messageListener.splice(messageListener.findIndex(m => m.member == message.author.id), 1);
                } else (
                    savetodb()
                )
            }, 60000 * 5);
        }
    }

    else {
        member.count++;
    }
    
})

const voicestatecollecttion = []
client.on("voiceStateUpdate", async (oldState, newState) => {
    if (newState.member.user.bot) return;

    //member joined voice channel
    if (!oldState.channel && newState.channel) {
        //add member to voice state collection
        voicestatecollecttion.push({date: new Date(), member: newState.member.id})
    }

    //member left voice channel
    if (oldState.channel && !newState.channel) {
        //get member from voice state collection and calculate the minutes they were in the voice channel
        var member = voicestatecollecttion.find(m => m.member == newState.member.id);
        if (!member) return;

        var minutes = Math.floor((new Date() - member.date) / 60000);

        if (minutes === 0) return;

        await new ACTIVITY_DATA({
            member: newState.member.id,
            action: `voice`,
            value: Math.floor(minutes),
            expires: lastDayOfMonthDate(),
            date: new Date(),
        }).save()
        
        //remove member from voice state collection
        voicestatecollecttion.splice(voicestatecollecttion.indexOf(member), 1);
    }
})


//calc gems
function calculatePoints() {
    //fetch database and get the total of all values
    ACTIVITY_DATA.find({}, (err, docs) => {
        if (err) console.log(err);

            //fetch all member and loop them
            client.guilds.cache.get("585511241628516352").members.cache.forEach(member => {
                //get total of message values
                var messageTotal = docs.filter(d => d.member == member.id && d.action == "message").reduce((acc, cur) => acc + cur.value, 0);
               
                //get total of voice values
                var voiceTotal = docs.filter(d => d.member == member.id && d.action == "voice").reduce((acc, cur) => acc + cur.value, 0);

                //remove all roles that dont belong
                function setroles(roletokeep) {
                    const acttivityroles = ["948288878471708733", "948288751052939305", "948288755586977832", "948288753301065798"]
                    var roles = member.roles.cache;
                    if (roles.has(roletokeep)) return;
                    if (roletokeep) member.roles.add(roletokeep);

                    roles.filter(r => acttivityroles.includes(r.id)).forEach(role => {
                        if (role.id != `${roletokeep ? roletokeep : ""}`) {
                            member.roles.remove(role.id);
                        }
                    })
                }

                if (messageTotal >= 100 && voiceTotal >= 60) {
                    setroles("948288878471708733");
                }
                else if (messageTotal >= 50 && voiceTotal >= 30) {
                    setroles("948288751052939305");
                }
                else if (messageTotal >= 50 || voiceTotal >= 20) {
                    setroles("948288753301065798");
                }
                else if (messageTotal >= 10) {
                    setroles("948288755586977832")
                }
                else {
                    setroles(null);
                }
                
            });


        }
    );
}

// run calculatePoints every midnight
const schedule = require('node-schedule');
    const job = schedule.scheduleJob('0 0 * * *', function(){
    calculatePoints();
  });