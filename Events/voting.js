const { client } = require("../index");
const VOTE = require('../Models/VOTES.js');
const votemessagebuilder = require('../Modules/votemessagebuilder.js');

client.on("interactionCreate", async interaction => {
    //check if interaction is a 
    
	if (interaction.isSelectMenu() && interaction.customId.startsWith('vote')) {
        //fetch vote from database
        const vote = await VOTE.findOne({_id: interaction.customId.split("_")[1]});
        if (!vote) return;

        //check if vote has ended
        if (vote.closingAt < new Date()) return await interaction.user.send("Diese Abstimmung ist bereits beendet!")

        //check if user has already voted
        if (vote.voted_users.find(user => user.id === interaction.user.id)) return await interaction.user.send("Du hast bereits abgestimmt!");

        //add user to voted_users in and add vote to answer
        vote.voted_users.push({id: interaction.user.id});
        vote.answers.find(answer => answer.id === interaction.values[0]).votes++;
        
        //update database
        await vote.updateOne({voted_users: vote.voted_users, answers: vote.answers});

        //update message
        interaction.update(await votemessagebuilder(vote));
}


    });

//track vote with future closing time
client.on("ready", async () => {
    //fetch all votes from database
    await VOTE.find({}, (err, votes) => {
        //create a cronjob for every vote that has a closing time in the future
        votes.forEach(vote => {
            if (vote.closingAt > new Date()) {
                endvote(vote)
            }
        })
    })
})

async function endvote(vote) {
    console.log("Scheduling end of vote")
    const schedule = require('node-schedule'); 
    const job = new schedule.scheduleJob(vote.closingAt, () => {
        //check again if enddate is in the future

        //end vote
        vote.closingAt = new Date();
        vote.save()
        client.channels.fetch(vote.channel).then(async channel => {
        await channel.send(votemessagebuilder(vote, true))

            //update message
            client.channels.cache.get(vote.channel).messages.fetch(vote.message).then(async message => {
                await message.edit(votemessagebuilder(vote, true))

                vote.message = message.id
                vote.channel = message.channel.id
                await vote.save()
            })
        })
    })
}

module.exports = endvote;