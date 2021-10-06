const { client } = require("../index");
const MEMBER = require("../Models/MEMBER")

client.on("messageCreate", (message) => {
    if (message.content.toLowerCase() != "!d bump") return;

    //starts "typing" in chat
    message.channel.sendTyping()
    const sendpost = setInterval(() => {message.channel.sendTyping()}, 8000)

    async function valid_bump_check(message) {
        clearInterval(sendpost)
        if (message.author.id != "302050872383242240") return message.channel.send("Bump fehlgeschlagen...");
        if (!message.embeds) return message.channel.send("Bump fehlgeschlagen...");
        if (message.embeds[0].color != "2406327") return message.channel.send("Bump fehlgeschlagen...");

        //bump successfull
        await MEMBER.findOne({ id: message.author.id }).then(async doc => {
            doc.currencys.coins.log.push({
            description: "Disboard Bump reward",
            value: 300,
            date: new Date(),
            });

            await MEMBER.findOneAndUpdate(
                { id: doc.id },
                {
                "currencys.coins.amount": doc.currencys.coins.amount + 300,
                "currencys.coins.log": doc.currencys.coins.log,
                }
            ).then(newdoc => {
                message.channel.send("Bump Belohnung zu deinen Coins hinzugefügt!")
        })
        })
    }

    //check last message if disboard awnsered really fast
    message.channel.messages.fetch({after: message.id, around: message.id}).then(messages => {
        if (messages.first() != null) {
            valid_bump_check(messages.first())
        }
    })

    //if no message of disboard has arrived yet, wait for it
    const filter = m => m.author.id === "302050872383242240";
    message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]}).then(async collected => {

        valid_bump_check(collected.first())


    }).catch(() => {
        clearInterval(sendpost)
        message.channel.send("Bump fehlgeschlagen...")
    })
})

