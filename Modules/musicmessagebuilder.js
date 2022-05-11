var Discord = require('discord.js');
//export funktion
module.exports =  function MusicNowPlayingMessageBuilder(Musicdata) {

    //create buttons
    const interactionRow1 = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton({label: "back", emoji: "⏮️", customId: "music_back", style: "SECONDARY", disabled: Musicdata.currentindex == 0}),
        Musicdata.paused ? new Discord.MessageButton({label: "continue", emoji: "▶️", customId: "music_pause", style: "SECONDARY" }) : new Discord.MessageButton({label: "pause", emoji: "⏸️", customId: "music_pause", style: "SECONDARY" }),
        new Discord.MessageButton({label: "skip", emoji: "⏭️", customId: "music_skip", style: "SECONDARY", disabled: Musicdata.queue.length == 0}),
        new Discord.MessageButton({label: "Link to Song", style: "LINK", url: Musicdata.queue[Musicdata.currentindex].info.uri}),

    )
    const interactionRow2 = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton({label: "shuffle", emoji: "🔀", customId: "music_shuffle", style: "SECONDARY"}),
        new Discord.MessageButton({label: "loop", emoji: "🔂", customId: "music_loop", style: Musicdata.loop ? "PRIMARY" : "SECONDARY"}),
        new Discord.MessageButton({label: "stop", emoji: "⏹️", customId: "music_stop", style: "SECONDARY"}),
        new Discord.MessageButton({label: "clear queue", emoji: "🗑️", customId: "music_clear", style: "SECONDARY"}),
    )

        const embed = new Discord.MessageEmbed()
            .setColor('#2c2f33')
            .setTitle(`NOW PLAYING`)
            .setDescription("<a:music_disc:973642750668963842>" + `[\`${Musicdata.queue[Musicdata.currentindex].info.title}\`](${Musicdata.queue[Musicdata.currentindex].info.uri})`)
            .addField("Requested by", `<@${Musicdata.queue[Musicdata.currentindex].requested_by}>`, true)
            .addField("Song by", `${Musicdata.queue[Musicdata.currentindex].info.author}`, true)
            .addField("duration", `\`> ${require("./timetamp builder")(Musicdata.queue[Musicdata.currentindex].info.length)} <\``, true)
            .addField("source", `${Musicdata.queue[Musicdata.currentindex].info.sourceName.toUpperCase()}`, true)

    return {embeds: [embed], components: [interactionRow1, interactionRow2]};
}