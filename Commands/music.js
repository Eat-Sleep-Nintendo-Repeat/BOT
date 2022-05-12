const { MessageEmbed } = require("discord.js");
const lavacordManager = require("../index").musicmanager
const urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
const axios = require("axios");

const Musicdata = {};

const {client} = require("../index");

//Music commmand
exports.command = {
    name: 'Musik',
	call: 'musik',
	description: 'Erlaubt es in deinem Voice Channel Musik zu hören',

    options: [
        {
            name: "play",
            description: "Einen Song zur Wiedergabe hinzufügen",
            type: 1,
            options: [
                {
                    name: "url_or_search",
                    description: "Link zum Song oder Suchbegriff",
                    type: 3,
                    required: true,
                    autocomplete: true
                }
            ]
        },
        {
            name: "stop",
            description: "Stoppe die Wiedergabe",
            type: 1,
            options: []
        },
        {
            name: "pause",
            description: "Pausiere die Wiedergabe",
            type: 1,
            options: []
        },
        {
            name: "resume",
            description: "Setze die Wiedergabe fort",
            type: 1,
            options: []
        },
        {
            name: "skip",
            description: "Überspringe den aktuellen Song",
            type: 1,
            options: []
        },
        {
            name: "queue",
            description: "Zeige die Warteschlange",
            type: 1,
            options: []
        },
        {
            name: "volume",
            description: "Setze die Lautstärke",
            type: 1,
            options: [
                {
                    name: "volume",
                    description: "Lautstärke in Prozent",
                    type: 4,
                    required: true,
                    min_value: 0,
                    max_value: 100
                }
            ]
        },
        {
            name: "shuffle",
            description: "Mische die Warteschlange",
            type: 1,
            options: []
        },
        {
            name: "loop",
            description: "Wiederhole den aktuellen Song",
            type: 1,
            options: []
        },
        {
            name: "clear",
            description: "Lösche die Warteschlange",
            type: 1,
            options: []
        },
        {
            name: "back",
            description: "Spiele den letzten Song",
            type: 1,
            options: []
        },
        {
            name: "remove",
            description: "Entferne einen Song aus der Warteschlange",
            type: 1,
            options: [
                {
                    name: "index",
                    description: "Index des Songs in der Warteschlange",
                    type: 4,
                    required: true,
                    min_value: 0
                }
            ]
        },
        {
            name: "playtop",
            description: "Füge einen Song an die oberste Stelle der Warteschlange",
            type: 1,
            options: [
                {
                    name: "url_or_search",
                    description: "Link zum Song oder Suchbegriff",
                    type: 3,
                    required: true,
                    autocomplete: true
                }
            ]
        },
        {
            name: "sticky",
            description: "Klebe den Bot an dich, damit er dir in alle Talks folgt",
            type: 1,
            options: []
        },
        {
            name: "skipto",
            description: "Springe zu einem bestimmten Song in der Warteschlange",
            type: 1,
            options: [
                {
                    name: "index",
                    description: "Index des Songs in der Warteschlange",
                    type: 4,
                    required: true,
                    min_value: 0
                }
            ]
        },
    ],

    permission: ["CONNECT", "SPEAK"],

	async execute(interaction) {


        //check if user is in a voice channel
        if (!interaction.member.voice.channel) {
            interaction.reply({ephemeral: true, content: "Du befindest dich nicht in einem Voice Channel"});
            return;
        }

        //if there is an Muicdata for this guild then check if the user is in the voice channel
        if (Musicdata[interaction.guildId]) {
            if (Musicdata[interaction.guildId].channel != interaction.member.voice.channel) {
                interaction.reply({ephemeral: true, content: "Der Bot ist nicht in deinem Voice Channel"});
                return;
            }
        }

        //commands that need an active music session
        if (Musicdata[interaction.guildId]) {
            switch (interaction.options._subcommand) {
                case "play":
                    play(interaction, interaction.options.get("url_or_search").value, false);
                    break;
                case "stop":
                    stop(interaction);
                    break;
                case "pause":
                    //check if paused
                    if (Musicdata[interaction.guildId] && Musicdata[interaction.guildId].paused) {
                    resume(interaction);
                    } else {
                    pause(interaction);
                    }
                    break;
                case "resume":
                    if (Musicdata[interaction.guildId] && Musicdata[interaction.guildId].paused) {
                        resume(interaction);
                    }
                    else {
                        interaction.reply("Die Wiedergabe ist nicht pausiert!");
                    }
                    break;
                case "skip":
                    skip(interaction);
                    break;
                case "volume":
                    volume(interaction, interaction.options.get("volume").value);
                    break;
                case "shuffle":
                    shuffle(interaction);
                    break;
                case "loop":
                    loop(interaction);
                    break;
                case "clear":
                    clear(interaction);
                    break;
                case "back":
                    back(interaction);
                    break;
                case "remove":
                    remove(interaction, interaction.options.get("index").value);
                    break;
                case "playtop":
                    play(interaction, interaction.options.get("url_or_search").value, true);
                    break;
                case "sticky":
                    sticky(interaction);
                    break;
                case "skipto":
                    skipto(interaction, interaction.options.get("index").value);
                    break;
                case "queue":
                    queue(interaction);
                    break;
                default:
                    break;
            }
        }
        //commands that can be used without an active music session
        else {
            switch (interaction.options._subcommand) {
                case "play":
                case "playtop":
                    play(interaction, interaction.options.get("url_or_search").value, false);
                    break;
                default: 
                    interaction.reply({ ephemeral: true, content: "Aktuell ist keine Musik Session aktiv" });
            }
        }

    },
};

//Infomessage contoller
client.on("interactionCreate", (interaction) => {
    if (!interaction.isButton()) return
    if (!interaction.customId.startsWith('music')) return;

    //check if interaction guild has a running music session
    if (!Musicdata[interaction.guildId]) return interaction.reply({ ephemeral: true, content: "Keine Musik Session aktiv" });
    if (Musicdata[interaction.guildId].channel != interaction.member.voice.channel) return interaction.reply({ ephemeral: true, content: "Der Bot ist nicht in deinem Voice Channel" });


    interaction.reply = function (options) {
    }

    switch (interaction.customId.replace("music_", "")) {
        case "back":
            back(interaction);
        break;
        case "pause":
            if (Musicdata[interaction.guildId] && Musicdata[interaction.guildId].paused) {
                resume(interaction);
            } else {
                pause(interaction);
            }
        break;
        case "skip":
            skip(interaction);
        break;
        case "shuffle":
            shuffle(interaction);
        break;
        case "loop":
            loop(interaction);
        break;
        case "stop":
            stop(interaction);
        break;
        case "clear":
            clear(interaction);
        break;
    }

        if (interaction.customId.replace("music_", "") == "skip" || interaction.customId.replace("music_", "") == "back") {
            interaction.deferUpdate();
        }
        else {
            interaction.update(require("../Modules/musicmessagebuilder")(Musicdata[interaction.guild.id]));
        }
        
       
        
});

//play command youtube search autocomplete
client.on("interactionCreate", (interaction) => {
    if (!interaction.isAutocomplete()) return;
    if (!interaction.options._subcommand.startsWith("play")) return;

    //Serch Youtube Term per Youtube API
    const search = require("yt-search");
    search({query: interaction.options.get("url_or_search").value, }, function (err, results) {
        if (err || !results) return interaction.respond([]);

        interaction.respond(results.videos.slice(0, 10).map(video => ({name: video.title, value: video.url})));
    })

})

//sticky checker
client.on("voiceStateUpdate", (oldMember, newMember) => {
    if (!Musicdata[newMember.guild.id]) return;
    if (!oldMember.channel) return;
    if (oldMember.channel.id == newMember.channel.id) return;
    if (newMember.id != Musicdata[newMember.guild.id].sticky) return;

    //move bot to sticky user
    Musicdata[newMember.guild.id].player.switchChannel(newMember.channel.id, {selfdeaf: true});
})

async function playcore(interaction) {
    //if fresh send message
    if (Musicdata[interaction.guildId].fresh) {
        //add init message with controls
        Musicdata[interaction.guildId].fresh = false;
    }

    //check if there is a song in the queue after currentindex. If not end session
    if (Musicdata[interaction.guildId].queue.length <= Musicdata[interaction.guildId].currentindex) {
        //leave voice
        await lavacordManager.leave(interaction.guildId);
        Musicdata[interaction.guildId] = null;
        return;
    }

    //check channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.channel.send("Du musst in einem Voicechannel sein um Musik zu hören!");
    }

    //check permissions
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        interaction.message.channel.send("Mir fehlen die Berechtigungen um Musik abzuspielen!");
        return;
    }

    //create player if there isnt one
    if (!Musicdata[interaction.guildId].player) {
        Musicdata[interaction.guildId].player = await lavacordManager.join({
            guild: interaction.guildId,
            channel: voiceChannel.id,
            node: lavacordManager.idealNodes[0].id,
        }, {selfdeaf: true});
        //set channel id to the voice channel
        Musicdata[interaction.guildId].channel = voiceChannel.id;
        await Musicdata[interaction.guildId].player.volume(Musicdata[interaction.guildId].volume);
    }

    //play next song from queue
    await Musicdata[interaction.guildId].player.play(Musicdata[interaction.guildId].queue[Musicdata[interaction.guildId].currentindex].track);
    waitforend();

    //control info message

    if (Musicdata[interaction.guildId].controllmsg && Musicdata[interaction.guildId].loop == false) {
        if (interaction.channel.lastMessageId === Musicdata[interaction.guildId].controllmsg) {
            //edit controll message
            const controllmsg = await interaction.channel.messages.fetch(Musicdata[interaction.guildId].controllmsg);
            controllmsg.edit(require("../Modules/musicmessagebuilder")(Musicdata[interaction.guild.id]));
        } else {
            //delte controll message and send new one
            await interaction.channel.messages.fetch(Musicdata[interaction.guildId].controllmsg).then(msg => msg.delete());
            interaction.channel.send(require("../Modules/musicmessagebuilder")(Musicdata[interaction.guild.id])).then(msg => {
            Musicdata[interaction.guildId].controllmsg = msg.id;
            });
        }
    } else if (Musicdata[interaction.guildId].loop == false) {

        //Send now playing message
        interaction.channel.send(require("../Modules/musicmessagebuilder")(Musicdata[interaction.guild.id])).then(msg => {
        Musicdata[interaction.guildId].controllmsg = msg.id;
        })
        
    }


    //listener that fires when a song is skipped, stopped or finished
    async function waitforend() {
        Musicdata[interaction.guildId].player.once("end", async (data) => {
            if (data.reason === "REPLACED") return waitforend();

            //add currentindex by 1 if not looping and if not backed
            if (!Musicdata[interaction.guildId].loop && !Musicdata[interaction.guildId].queue[Musicdata[interaction.guildId].currentindex].backed) {
                //Set backed to false
                Musicdata[interaction.guildId].currentindex++;
            } else {
                //if it was backed then set backed to false (so the queue wont stay on the same song for ever)
                Musicdata[interaction.guildId].queue[Musicdata[interaction.guildId].currentindex].backed = false;
            }

            //cleanup if stopped
            if (Musicdata[interaction.guildId].stopped) {
                //clear queue
                Musicdata[interaction.guildId].queue = [];
                return playcore(interaction);
            }

            //repeats the process
            playcore(interaction);
        });
    }
    
};

async function play (interaction, url, ontop) {
const node = lavacordManager.idealNodes[0];

// Check if the url is a valid youtube url
var searchTerm = url;

const params = new URLSearchParams();
params.append("identifier", urlRegex.test(searchTerm) ? searchTerm : `ytsearch:${searchTerm}`);

// Get the video info and load it into lavacord
const data = await axios(`http://${node.host}:${node.port}/loadtracks?${params}`, {
  headers: {
    Authorization: node.password,
  },
});

// Check if the video is valid
if (data.data.loadType == "NO_MATCHES") return interaction.reply({ ephemeral: true, content: "Ich habe für diesen Query keinen Song gefunden" })
if (data.data.loadType == "LOAD_FAILED") {
  return interaction.reply({ ephemeral: true, content: "Ich konnte den Song nicht laden" })
}
if (data.data.tracks.length == 0) return interaction.reply({ ephemeral: true, content: "Ich habe für diesen Query keinen Song gefunden" })

const track = data.data.tracks[0];
track.requested_by = interaction.member.id;

//create session object if it doesn't exist
if (!Musicdata[interaction.guildId]) {
    Musicdata[interaction.guildId] = {channel: null, queue: [], currentindex: 0, loop: false, volume: 50, stopped: false, paused: false, fresh: true, player: null, sticky: null, dj: [], controllmsg: null };
}

// Add the track to the queue
if (data.data.loadType == "TRACK_LOADED" || data.data.loadType == "SEARCH_RESULT") {
    if (ontop) {
        //put track after currentindex
        Musicdata[interaction.guildId].queue.splice(Musicdata[interaction.guildId].currentindex + 1, 0, track);
    } else {
        Musicdata[interaction.guildId].queue.push(track);
    }
}

//Add playlist to queue
if (data.data.loadType == "PLAYLIST_LOADED") {
    if (ontop) {
        return interaction.reply({ ephemeral: true, content: "Playlists können nicht an den Anfang der Warteschlange gepusht werden" })
    } else {
        data.data.tracks.forEach(track => {
            track.requested_by = interaction.user.id;
            Musicdata[interaction.guildId].queue.push(track);
        });
    }
}

//start core if fresh
if (Musicdata[interaction.guildId].fresh) {
    playcore(interaction);
};

//send message
interaction.reply({ ephemeral: true, content: "Ich habe den Song in die Warteschlange gelegt" })
};

async function skip(interaction) {
    //stop player
    Musicdata[interaction.guildId].player.stop();

    interaction.reply({ ephemeral: false, content: "Ich habe den Song übersprungen" })
};

async function skipto(interaction, trackindex) {
    //check if trackindex is not higher than queue length
    if (trackindex > Musicdata[interaction.guildId].queue.slice(Musicdata[interaction.guildId].currentindex, Musicdata[interaction.guildId].queue.length).length) {
        return interaction.reply({ ephemeral: true, content: "So viele Songs gibt es nicht in der Queue" })
    }

    //set currentindex to the trackindex - 1 and stop player
    Musicdata[interaction.guildId].currentindex = Musicdata[interaction.guildId].currentindex + trackindex - 2;
    Musicdata[interaction.guildId].player.stop();

    interaction.reply({ ephemeral: false, content: `Ich bin zum Song "${Musicdata[interaction.guildId].queue[Musicdata[interaction.guildId].currentindex + 1].info.title}" gesprungen` })
};

async function back(interaction) {
    //if current index is higher than 0 than reduce index by 1
    if (Musicdata[interaction.guildId].currentindex > 0) {
        Musicdata[interaction.guildId].currentindex--;
        Musicdata[interaction.guildId].queue[Musicdata[interaction.guildId].currentindex].backed = true;
        //end player
        Musicdata[interaction.guildId].player.stop();
        interaction.reply({ ephemeral: false, content: "Ich bin einen Song zurück gegangen" })
    } else {
        //reply message
        interaction.reply({ ephemeral: false, content: "Du bist bereits am Anfang" })
    }
};

async function pause(interaction) {
    //pause player
    Musicdata[interaction.guildId].player.pause(true);
    Musicdata[interaction.guildId].paused = true;
    //reply message
    interaction.reply({ ephemeral: false, content: "Ich habe die Wiedergabe pausiert" })
};

async function resume(interaction) {
    //resume player
    Musicdata[interaction.guildId].player.pause(false);
    Musicdata[interaction.guildId].paused = false;
    //reply message
    interaction.reply({ ephemeral: false, content: "Ich habe die Wiedergabe fortgesetzt" })
};

async function stop(interaction) {
    //set stopped to true and stop player
    Musicdata[interaction.guildId].stopped = true;
    Musicdata[interaction.guildId].player.stop();
    //reply message
    interaction.reply({ ephemeral: false, content: "Ich habe die Wiedergabe beendet" })
};

async function volume(interaction, volume) {
    //set volume
    Musicdata[interaction.guildId].volume = volume;
    Musicdata[interaction.guildId].player.volume(volume);
    //reply message
    interaction.reply({ ephemeral: false, content: "Ich habe die Lautstärke auf " + volume + "% gesetzt" })
};

async function loop(interaction) {
    //toggle loop
    Musicdata[interaction.guildId].loop = !Musicdata[interaction.guildId].loop;
    //reply message
    interaction.reply({ ephemeral: false, content: "Der aktuelle Song wird ab jetzt " + (Musicdata[interaction.guildId].loop ? "wiederholt" : "nicht mehr wiederholt") })
};

async function queue(interaction) {
    const MillisecondsToTimesamp = require("..//Modules/timetamp builder");

    //create embed
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Song Queue (${Musicdata[interaction.guildId].queue.slice(Musicdata[interaction.guildId].currentindex, Musicdata[interaction.guildId].queue.length).length})`)

    //Queue in die description
    let description = "";
    description = description + Musicdata[interaction.guildId].queue.slice(Musicdata[interaction.guildId].currentindex, Musicdata[interaction.guildId].queue.length).map((track, index) => {
        return `\`\`${index + 1}.\`\` [${track.info.title}](${track.info.uri}) II \`${MillisecondsToTimesamp(track.info.length, true)}\` - <@${track.requested_by}>`
    }).join("\n");

    //crop description if too long
    if (description.length > 2048) {
        description = description.substring(0, 2045) + "...";
    }

    //set description
    embed.setDescription(description);

    //Hörlänge als Field footer
    const length = Musicdata[interaction.guildId].queue.reduce((acc, cur) => acc + cur.info.length, 0);
    embed.setFooter("Hörlänge: " + MillisecondsToTimesamp(length, false));

    // Sticky als Field if Sticky is set
    if (Musicdata[interaction.guildId].sticky) {
        embed.addField("Sticky:", `<@${Musicdata[interaction.guildId].sticky}>`, true);
    }

    //DJ als Field if DJ is set
    if (Musicdata[interaction.guildId].dj) {
        //fetch if dj is a member or a role
        const member = interaction.guild.members.cache.get(Musicdata[interaction.guildId].dj);
        const role = interaction.guild.roles.cache.get(Musicdata[interaction.guildId].dj);
        if (member) {
            embed.addField("DJ:", `<@${member.id}>`, true);
        } if (role) {
            embed.addField("DJ:", `Alle mit der Rolle <@&${role.id}>`, true);
        }
    }

    //send message
    interaction.reply({ ephemeral: false, embeds: [embed] })
};

async function sticky(interaction) {
    //check if current sticky is same as user id
    if (Musicdata[interaction.guildId].sticky == interaction.user.id) {
        //set sticky to null
        Musicdata[interaction.guildId].sticky = null;
        //reply message
        interaction.reply({ ephemeral: false, content: `<@${interaction.user.id}> war duschen. Ich werde mit dem Member nicht mehr gemeinsam den Talk wechseln.` })
    } else {
        //set sticky to user id
        Musicdata[interaction.guildId].sticky = interaction.user.id;
        //reply message
        interaction.reply({ ephemeral: false, content: `<@${interaction.user.id}> ist klebrig. Ich klebe an <@${interaction.user.id}> fest, wenn der Talk gewechselt wird.` })
        }
};

async function clear(interaction) {
    //clear queue
    Musicdata[interaction.guildId].queue = [Musicdata[interaction.guildId].queue[Musicdata[interaction.guildId].currentindex]];
    //set current index to 0
    Musicdata[interaction.guildId].currentindex = 0;
    //reply message
    interaction.reply({ ephemeral: false, content: "Ich habe die Queue geleert" })
}

async function shuffle(interaction) {
    //take all upcoming songs, remove them from queue, shuffel them add them to the queue
    const upcoming = Musicdata[interaction.guildId].queue.slice(Musicdata[interaction.guildId].currentindex + 1, Musicdata[interaction.guildId].queue.length);
    Musicdata[interaction.guildId].queue = Musicdata[interaction.guildId].queue.slice(0, Musicdata[interaction.guildId].currentindex + 1);
    upcoming.sort(() => Math.random() - 0.5);
    Musicdata[interaction.guildId].queue = Musicdata[interaction.guildId].queue.concat(upcoming);
    //reply message
    interaction.reply({ ephemeral: false, content: "Ich habe die Queue gemischt" })
}

async function remove(interaction, index) {
    //check if index is valid
    index = index - Musicdata[interaction.guildId].currentindex - 1;

    if (index < 0 || index > Musicdata[interaction.guildId].queue.length - 1) {
        //reply message
        interaction.reply({ ephemeral: false, content: "Ich kann diesen Song nicht entfernen" })
    } else {
        //remove song from queue
        Musicdata[interaction.guildId].queue.splice(index, 1);
        //reply message
        interaction.reply({ ephemeral: false, content: "Ich habe den Song entfernt" })
    }

    
}