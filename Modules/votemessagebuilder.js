var Discord = require('discord.js');
const ImageCharts = require('image-charts');

//export funktion
module.exports =  function VoteMessageBuilder(vote, endversion) {


    //intiger to emoji converter
    const intToEmoji = function (int, unicode) {
        var output = "";
        //int to string
        var int = int.toString();
        int.split("").forEach(function (e) {
            // e to emoji
                switch (e) {
                    case "1":
                        output += `${unicode ? "1️⃣" : ":one:"}`;
                        break;
                    case "2":
                        output += `${unicode ? "2️⃣" : ":two:"}`;
                        break;
                    case "3":
                        output += `${unicode ? "3️⃣" : ":three:"}`;
                        break;
                    case "4":
                        output += `${unicode ? "4️⃣" : ":four:"}`;
                        break;
                    case "5":
                        output += `${unicode ? "5️⃣" : ":five:"}`;
                        break;
                    case "6":
                        output += `${unicode ? "6️⃣" : ":six:"}`;
                        break;
                    case "7":
                        output += `${unicode ? "7️⃣" : ":seven:"}`;
                        break;
                    case "8":
                        output += `${unicode ? "8️⃣" : ":eight:"}`;
                        break;
                    case "9":
                        output += `${unicode ? "9️⃣" : ":nine:"}`;
                        break;
                    case "0":
                        output += `${unicode ? "0️⃣" : ":zero:"}`;
                        break;
                    default:
                        output += "?";
                        break;
                }
        });

        //
        return output;
    };

    //votes of an answer in percent
    const votesInPercent = function (votes) {
        return Math.round((votes / vote.voted_users.length) * 100) + "%";
    };

    if (!endversion) {
    
        const embed = new Discord.MessageEmbed();
        const interaction = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId(`vote_${vote.id}`)
            .setPlaceholder("Abstimmen...")
            .setMaxValues(vote.maxvotes)
            .setMinValues(vote.minvotes)
        )

        embed.setTitle("⚖ Abstimmung: **" + vote.question + "**");
        embed.setColor("RANDOM");
        embed.setFooter("Abstimmungs-ID: " + vote.id);

        embed.setDescription(vote.answers.map(answer => `${intToEmoji(vote.answers.indexOf(answer) + 1, false)} ${answer.answer} \` ${answer.votes} (${votesInPercent(answer.votes)}) \``).join("\n\n"));

        embed.setFooter(embed.footer.text + "\nDu hast nur eine Stimme!")

        //add min and max votes to footer if its set and not 0
        if (vote.minvotes > 1) {
            embed.setFooter(embed.footer.text + " (Minimal: " + vote.minvotes + " Antworten)");
        }
        if (vote.maxvotes > 1) {
            embed.setFooter(embed.footer.text + " (Maximal: " + vote.maxvotes + " Antworten)");
        }

        // add all answers to interaction
        interaction.components[0].addOptions(vote.answers.map(answer =>( {
            label: `${vote.answers.length < 9 ? "" : intToEmoji(vote.answers.indexOf(answer) + 1, true)}` + answer.answer,
            value: answer.id,
            emoji: vote.answers.length < 9 ? intToEmoji(vote.answers.indexOf(answer) + 1, true) : null})));

        return {embeds: [embed], components: [interaction]};
    }

    else {

    
        const embed = new Discord.MessageEmbed();
        const interaction = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId(`vote_${vote.id}`)
            .setPlaceholder("Abstimmung abgeschlossen...")
            .setDisabled(true)
        )

        embed.setTitle("📊 Abstimmungergebniss: **" + vote.question + "**");
        embed.setColor("RANDOM");
        embed.setFooter("Abstimmungs-ID: " + vote.id);

        //sort answers by votes
        vote.answers.sort(function (a, b) {
            return b.votes - a.votes;
        });

        //generate image
        const chart_url = ImageCharts()
        .cht('p3')
        .chs('700x190')
        .chd(`t:${vote.answers.map(x => (`${x.votes}`)).join(",")}`)
        .chl(vote.answers.map(x => (`${x.answer}`)).join("|"))
        .toURL();
        embed.setImage(chart_url);

        embed.setDescription(vote.answers.map(answer => 
            `${vote.answers.indexOf(answer) === 0 ? "**👑" : ""}
            ${intToEmoji(answer.order + 1, false)} ${answer.answer} \` ${answer.votes} (${votesInPercent(answer.votes)}) \`
            ${vote.answers.indexOf(answer) === 0 ? "**" : ""}`).join("\n\n"));

        // add all answers to interaction
        interaction.components[0].addOptions(vote.answers.map(answer =>( {
            label: `${vote.answers.length < 9 ? "" : intToEmoji(vote.answers.indexOf(answer) + 1, true)}` + answer.answer,
            value: answer.id,
            emoji: vote.answers.length < 9 ? intToEmoji(vote.answers.indexOf(answer) + 1, true) : null})));

        return {embeds: [embed], components: [interaction]};

    }
}