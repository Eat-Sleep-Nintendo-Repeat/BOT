const socket = require("./socketio")
const {client} = require("../index")
const config = require("../config.json")
const { MessageEmbed } = require("discord.js")
const SHOP_ARTIKEL = require("../Models/SHOP-ARTIKEL")

//post message in log channel
socket.on("log", (data) => {
    var Embed = new MessageEmbed()
    if (data.color){Embed.setColor(data.color)}
    if (data.title){Embed.setTitle(data.title)}
    if (data.description){Embed.setDescription(data.description)}
    if (data.fields){Embed.setFields(data.fields)}
    
    client.channels.cache.get("644283425389412357").send({embeds: [Embed]})
})

socket.on(`log_330380702505762817`, (data) => {
    console.log("[SOCKET.IO LOG-CHANNEL] " + `${data.message ? data.message : data.error}`)
})

//shop handeling
socket.on("shop_purchase", async ({oid, user, is_gift, giving_user, item}) => {
    //fetch Shop Item
    const ItemDB = await SHOP_ARTIKEL.findOne({order_id: item})

    var guild = client.guilds.cache.get("585511241628516352")
    var member = user

    if (!is_gift) {
    //evaluate code
    try {
        eval(ItemDB.activate_code)
        //send confirmation
        socket.emit(`shop_confirmation_${oid}`, {successfull: true})
    } catch (error) {console.log(error)}
    }

    if (is_gift) {
        try {
            guild.members.cache.get(member).user.send({embeds: [
                new MessageEmbed()
                .setTitle("Geschenk Notification")
                .setDescription("Du hast soeben ein Item aus dem Eat, Sleep, Nintendo, Repeat Shop geschenkt bekommen!")
                .setColor(config.colors.someshit)
                .addField("Von:", client.users.cache.get(giving_user).username + "#" + client.users.cache.get(giving_user).discriminator, true)
                .addField("Item", ItemDB.name, true)
            ]})
        } catch (error) {
            console.log(error)
        }
    }
})

socket.on("shop_activate", async ({oid, user, item}) => {
    //fetch Shop Item
    const ItemDB = await SHOP_ARTIKEL.findOne({order_id: item})

    var guild = client.guilds.cache.get("585511241628516352")
    var member = user


    //evaluate code
    try {
        eval(ItemDB.activate_code)
        //send confirmation
        socket.emit(`shop_confirmation_${oid}`, {successfull: true})
    } catch (error) {console.log(error)}

})

socket.on("shop_deactivate", async ({oid, user, item}) => {
    //fetch Shop Item
    const ItemDB = await SHOP_ARTIKEL.findOne({order_id: item})

    var guild = client.guilds.cache.get("585511241628516352")
    var member = user


    //evaluate code
    try {
        eval(ItemDB.deactivate_code)
        //send confirmation
        socket.emit(`shop_confirmation_${oid}`, {successfull: true})
    } catch (error) {console.log(error)}

})