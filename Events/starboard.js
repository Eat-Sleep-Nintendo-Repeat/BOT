var {client} = require("../index")
var {MessageEmbed} = require("discord.js")
var STARBOARD = require("../Models/STARBOARD")
var IMAGE_STORE = require("../Models/IMAGESTORE");
const {nanoid} = require("nanoid")

var required_stars = 3;

client.on("messageReactionAdd", async (messageReaction, user) => {
    if (messageReaction.partial) await messageReaction.fetch().then(f => messageReaction = f)
    if (messageReaction.emoji.name != "⭐") return;
    if (user.bot) return;
    if (messageReaction.count >= required_stars == false) return;

    var starboarddb = await STARBOARD.findOne({"message": messageReaction.message.id})

    //fetch avatar from imagestore
    var image = await IMAGE_STORE.findOne({ type: "avatar", belong_to: messageReaction.message.author.id});

    if (image) messageReaction.message.author.avatarURL = () => {
        return `https://eat-sleep-nintendo-repeat.eu/api/imagestore/${image.id}`
    }

    
    //new starboard message
    if (!starboarddb){
        var inembedfilesregex = new RegExp(`^.*\.(jpg|JPG|png|PNG|jpeg|JPEG|gif|gifv)$`)
        var outofembedfilesregex = new RegExp(`^.*\.(webm|mp4|wav|mp3|ogg)$`)

            var date = new Date()

            //safe profileimage somewhere (api) so the bot can access it still after image change/left server

            var files = [];
            var Embed = new MessageEmbed()
            .setColor("#36FF72")
            .setAuthor(messageReaction.message.member.displayName + `${messageReaction.message.member.displayName != messageReaction.message.member.user.username ? ` aka: ${messageReaction.message.member.user.username}#${messageReaction.message.member.user.discriminator}` : `#${messageReaction.message.member.user.discriminator}`}`, messageReaction.message.author.avatarURL())
            .setDescription(`${messageReaction.message.content}\n\n **[Jump to Message](${messageReaction.message.url})**`)
            .setThumbnail("https://media.discordapp.net/attachments/866410353003593758/957757221595381840/Starboard.png")
            .setFooter(`${messageReaction.count} ⭐ | ${date.toLocaleString()}`)
            
            if (messageReaction.message.attachments.size > 0){
                //in embed files
                if (messageReaction.message.attachments.first().height != null && inembedfilesregex.test(messageReaction.message.attachments.first().name)){
                    Embed.setImage(messageReaction.message.attachments.first().url)
                }
                //out of embed files
                else if (outofembedfilesregex.test(messageReaction.message.attachments.first().name)){
                    files.push(messageReaction.message.attachments.first().url)
                }
                else {
                    Embed.addField("Anhang:", `[${messageReaction.message.attachments.first().name}](${messageReaction.message.url})`)
                }

            }

            client.channels.fetch("948286749430386698").then(chan => chan.send({embeds: [Embed], files: files}).then(async msg => {
                await new STARBOARD({"id": nanoid(15), "author": user.id, "message": messageReaction.message.id, "stars": messageReaction.users.cache.map(x => x.id), "content": messageReaction.message.cleanContent, "media": messageReaction.message.attachments.first(), "starbordmessage": msg.id}).save()
            }))
        
    }

    // Edit existing starboard message
    else {
        await STARBOARD.findOneAndUpdate({"message": messageReaction.message.id}, {"stars": messageReaction.users.cache.map(x => x.id)}).then(doc => {

            var inembedfilesregex = new RegExp(`^.*\.(jpg|JPG|png|PNG|jpeg|JPEG|gif|gifv)$`)
            var outofembedfilesregex = new RegExp(`^.*\.(webm|mp4|wav|mp3|ogg)$`)

            var files = [];
            var date = new Date(doc.date)
            var Embed = new MessageEmbed()
            .setColor("#36FF72")
            .setAuthor(messageReaction.message.member.displayName + `${messageReaction.message.member.displayName != messageReaction.message.member.user.username ? ` aka: ${messageReaction.message.member.user.username}#${messageReaction.message.member.user.discriminator}` : `#${messageReaction.message.member.user.discriminator}`}`, messageReaction.message.author.avatarURL())
            .setDescription(`${messageReaction.message.content}\n\n **[Jump to Message](${messageReaction.message.url})**`)
            .setThumbnail("https://media.discordapp.net/attachments/948286749430386698/957665601067819028/Starboard.png")
            .setFooter(`${messageReaction.count} ⭐ | ${date.toLocaleString()}`)
            
            if (messageReaction.message.attachments.size > 0){
                //in embed files
                if (messageReaction.message.attachments.first().height != null && inembedfilesregex.test(messageReaction.message.attachments.first().name)){
                    Embed.setImage(messageReaction.message.attachments.first().url)
                }
                //out of embed files
                else if (outofembedfilesregex.test(messageReaction.message.attachments.first().name)){
                    // files.push(messageReaction.message.attachments.first().url) not needed because its already posted
                }
                else {
                    Embed.addField("Anhang:", `[${messageReaction.message.attachments.first().name}](${messageReaction.message.url})`)
                }

            }

            //edit starboard message
            client.channels.fetch("948286749430386698").then(chan => chan.messages.fetch(doc.starbordmessage).then(msg => {
                msg.edit({embeds: [Embed]})
            }))

        })
    }
})

client.on("messageReactionRemove", async (messageReaction, user) => {
    if (messageReaction.partial) await messageReaction.fetch().then(f => messageReaction = f)
    if (messageReaction.emoji.name != "⭐") return;
    if (user.bot) return;
    // if (messageReaction.count >= required_stars == false) return;

    var starboarddb = await STARBOARD.findOne({"message": messageReaction.message.id})
    
    if (starboarddb) {
        //remove a star
        if (messageReaction.count >= required_stars) {
            await STARBOARD.findOneAndUpdate({"message": messageReaction.message.id}, {"stars": messageReaction.users.cache.map(x => x.id)}).then(doc => {

                var inembedfilesregex = new RegExp(`^.*\.(jpg|JPG|png|PNG|jpeg|JPEG|gif|gifv)$`)
                var outofembedfilesregex = new RegExp(`^.*\.(webm|mp4|wav|mp3|ogg)$`)

                var files = [];
                var date = new Date(doc.date)
                var Embed = new MessageEmbed()
                .setColor("#36FF72")
                .setAuthor(messageReaction.message.member.displayName + `${messageReaction.message.member.displayName != messageReaction.message.member.user.username ? ` aka: ${messageReaction.message.member.user.username}#${messageReaction.message.member.user.discriminator}` : `#${messageReaction.message.member.user.discriminator}`}`, messageReaction.message.author.avatarURL())
                .setDescription(`${messageReaction.message.content}\n\n **[Jump to Message](${messageReaction.message.url})**`)
                .setThumbnail("https://media.discordapp.net/attachments/948286749430386698/957665601067819028/Starboard.png")
                .setFooter(`${messageReaction.count} ⭐ | ${date.toLocaleString()}`)
                
                if (messageReaction.message.attachments.size > 0){
                    //in embed files
                    if (messageReaction.message.attachments.first().height != null && inembedfilesregex.test(messageReaction.message.attachments.first().name)){
                        Embed.setImage(messageReaction.message.attachments.first().url)
                    }
                    //out of embed files
                    else if (outofembedfilesregex.test(messageReaction.message.attachments.first().name)){
                        // files.push(messageReaction.message.attachments.first().url) not needed because its already posted
                    }
                    else {
                        Embed.addField("Anhang:", `[${messageReaction.message.attachments.first().name}](${messageReaction.message.url})`)
                    }

                }

                //edit starboard message
                client.channels.fetch("948286749430386698").then(chan => chan.messages.fetch(doc.starbordmessage).then(msg => {
                    msg.edit({embeds: [Embed]})
                }))

            })
        }

        //remove message from starboard
        else {
            await STARBOARD.findOneAndDelete({"message": messageReaction.message.id})
            client.channels.fetch("948286749430386698").then(chan => chan.messages.fetch(starboarddb.starbordmessage).then(msg => msg.delete()))
        }

    }
})