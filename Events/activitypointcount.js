const { MessageReaction } = require("discord.js");
const { client } = require("../index");
const ACTIVITY_POINTS_COLLECTION = require("../Models/ACTICITY POINTS.js");

function lastDayOfMonthDate() {
    const date = new Date();
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23)
    lastDayOfMonth.setMinutes(59)
    lastDayOfMonth.setSeconds(59)
    lastDayOfMonth.setMilliseconds(999)

    return lastDayOfMonth;
}

client.on("messageCreate", async (message) => {
    //check if the message is from a bot
    if (message.author.bot) return;
    
    //check im message is not a quote
    if (message.channelId != "598197456643293197") {
        var value = 1;

        //remove all links from Message content
        message.content = message.content.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi, "");

        value += Math.floor(message.content.length / 8);

        //check if message has attachments
        value += message.attachments.size * 5

        //check if message is a reply
        if (message.reference && message.reference.messageId) {
            //fetch message
            var messageRef = await (await client.channels.fetch(message.reference.channelId)).messages.fetch(message.reference.messageId);
            if (messageRef.author.id != message.author.id){
                value += 4;
                
                await new ACTIVITY_POINTS_COLLECTION({
                    member: messageRef.author.id,
                    action: `message-ref`,
                    value: 1 + (Math.floor(message.content.length / 12)),
                    expires: lastDayOfMonthDate(),
                    date: new Date(),
                }).save()
            }
        }

        //save to database
        await new ACTIVITY_POINTS_COLLECTION({
            member: message.author.id,
            action: `message${message.attachments.size > 0 ? "-attachment" : ""}`,
            value: value,
            expires: lastDayOfMonthDate(),
            date: new Date(),
        }).save()
    }
    //if message is a quote
    else {
        var value = message.mentions.members.size * 5;

        //give points to member who wrote the quote
        await new ACTIVITY_POINTS_COLLECTION({
            member: message.author.id,
            action: `quote`,
            value: value,
            expires: lastDayOfMonthDate(),
            date: new Date(),
        }).save()

        message.mentions.members.forEach(async m => {
            if (m.id == message.author.id) return; //dont give points to the author of the quote again

            await new ACTIVITY_POINTS_COLLECTION({
                member: m.user.id,
                action: `quoted`,
                value: 8,
                expires: lastDayOfMonthDate(),
                date: new Date(),
            }).save()
        })
    }
    

})

client.on("messageReactionAdd", async (MessageReaction, user) => {
    if (MessageReaction.partial) await MessageReaction.fetch().then((f) => MessageReaction = f)
    //give points to user who reacted
    if (user.bot) return;
    if (MessageReaction.message.member && MessageReaction.message.member.id == user.id) return;
    await new ACTIVITY_POINTS_COLLECTION({
        member: MessageReaction.message.author.id,
        action: `reaction-send`,
        value: 1,
        expires: lastDayOfMonthDate(),
        date: new Date(),
    }).save()
    //give points to user who got the reaction
    await new ACTIVITY_POINTS_COLLECTION({
        member: user.id,
        action: `reaction-recieve`,
        value: 1,
        expires: lastDayOfMonthDate(),
        date: new Date(),
    }).save()
})

const voicestatecollecttion = []
client.on("voiceStateUpdate", async (oldState, newState) => {

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

        await new ACTIVITY_POINTS_COLLECTION({
            member: newState.member.id,
            action: `voice`,
            value: Math.floor(minutes / 4),
            expires: lastDayOfMonthDate(),
            date: new Date(),
        }).save()
        
        //remove member from voice state collection
        voicestatecollecttion.splice(voicestatecollecttion.indexOf(member), 1);
    }
})