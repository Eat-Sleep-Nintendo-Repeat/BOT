const { client } = require("../index");
const config = require("../config.json")
const {axios, baseURL} = require("../Modules/api");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

client.on("voiceStateUpdate", (oldState, newState) => {
    if (newState.channel == null) return;
    if (newState.guild.id === "585511241628516352" && newState.channel.name.startsWith("🔴")){
        //fetch usemyvoice data from api
        axios.get(baseURL + `/usemyvoice/${newState.member.id}`).then(res => {

        var valid = true;

        //check if the use my voice is accepted
        if (res.data.accepted === false ) valid = false
        if (res.data.state != "accepted" ) valid = false
        if (new Date(res.data.date).getFullYear() != new Date().getFullYear()) valid = false

        //send dm if valid is false
        if (valid === false) {
            newState.member.voice.setChannel(null)
            newState.member.send({embeds: [
                new MessageEmbed().setColor(config.colors.warning).setTitle("ACHTUNG").setDescription("Du hast soeben versucht einem Voice Channel zu joinen, in dem aktuell deine Stimme aufgenommen, oder sogar gestreamt werden könnte. Wenn du trotzdem mitmachen möchtest, musst du erst unsere __Einverständniserklärung zur Nutzung von Stimmenaufnahmen__ akzeptieren. Unser FAQ, mehr Informationen und das Formular zum akzeptieren welches dich maximal 2 Minuten beschäftigen sollte, findest du [hier](https://app.eat-sleep-nintendo-repeat.eu/home/usemyvoice) oder beim Button unter dieser Message")
            ],
            components: [new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://app.eat-sleep-nintendo-repeat.eu/home/usemyvoice").setLabel("Zur Einverständniserklärung"))]})
        }

        }).catch(e => {
            var content = "REQUEST: " + e.message
            if (e.response && e.response.data.message) {
                content = "API: " + e.response.data.message
            }

            client.channels.cache.get("644283425389412357").send({embeds: [new MessageEmbed().setColor(config.colors.error).setTitle("Use my Voice Fehler > " + newState.member.id).setDescription("```" + content + "```")]})
        })
    }
})