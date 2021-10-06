const { MessageEmbed } = require("discord.js")
var {client} = require("../index")
var MEMBER = require("../Models/MEMBER")

client.on("guildMemberAdd", async (member) => {
    var memberdb = await MEMBER.findOne({"id": member.id})
    var type = 0;
    if (member.user.bot) type = 50

    var joinemoji   = client.emojis.cache.get("723485426144378913"), //#77b800
        rejoinemoji = client.emojis.cache.get("723487019241701477")//#00c2cb

    //add member to database if hes new
    if (!memberdb){
        await new MEMBER({
            id: member.id,
            informations: {name: member.user.username, discriminator: member.user.discriminator, avatar: member.user.avatar},
            type: type
        }).save()
        if (type == 50) return;
        client.channels.cache.get("585522626407956492").send({embeds: [new MessageEmbed().setColor("#77b800").setDescription(`${joinemoji} **${member.user.username}#${member.user.discriminator}** ist gerade ${member.guild.name} gejoint!`).setTimestamp(new Date()).setThumbnail(member.user.displayAvatarURL())]})
    }
    //member rejoined
    else {
        await MEMBER.findOneAndUpdate({id: member.id}, {joined: new Date(), delete_in: null});
        client.channels.cache.get("585522626407956492").send({embeds: [new MessageEmbed().setColor("#00c2cb").setDescription(`${rejoinemoji} **${member.user.username}#${member.user.discriminator}** ist gerade erneut ${member.guild.name} gejoint!\nWillkommen zurück ^^`).setTimestamp(new Date()).setThumbnail(member.user.displayAvatarURL())]})
    }


})

client.on("guildMemberRemove", async (member) => {
    var memberdb = await MEMBER.findOne({"id": member.id})

       var leaveemoji  = client.emojis.cache.get("723485426169413686") //#ff5757

    //new member doc
    if (!memberdb){}

    //member rejoined
    else {
        //decide how long we will keep the data of the leaving member in the Database
        var delete_date = new Date()
        delete_date.setHours(delete_date.getHours() + 1)
        if (memberdb.type > 0) delete_date.setMonth(delete_date.getMonth() + 3) // add 3 Months if member accepted the rules
        if (memberdb.currencys.ranks.rank > 15) delete_date.setMonth(delete_date.getMonth() + 3) //add another 3 months if member has a Level of 15 or higher
        if (memberdb.usemyvoice.accepted == true && memberdb.usemyvoice.date > delete_date) delete_date = memberdb.usemyvoice.date //if the use my voice one year panelty is bigger then the delte date > set the use my voice panelty as delte date

        if (member.user.bot) return await MEMBER.findOneAndDelete({id: member.id})
        await MEMBER.findOneAndUpdate({id: member.id}, {joined: new Date(), delete_in: delete_date, type: 0});
        client.channels.cache.get("585522626407956492").send({embeds: [new MessageEmbed().setColor("#ff5757").setDescription(`${leaveemoji} **${member.user.username}#${member.user.discriminator}** hat gerade ${member.guild.name} verlassen `).setFooter("Wir löschen die User Daten am ").setTimestamp(delete_date).setThumbnail(member.user.displayAvatarURL())]})
    }
})