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
        if (vote.endtime < Date.now()) return await interaction.user.send("Diese Abstimmung ist bereits beendet!")

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