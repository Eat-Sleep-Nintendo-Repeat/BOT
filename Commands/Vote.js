const VOTE = require('../Models/VOTES.js');
const votemessagebuilder = require('../Modules/votemessagebuilder.js');
const nanoid = require('nanoid').nanoid;

exports.command = {
	name: 'Abstimmung Erstellen',
	call: 'vote',
	description: 'Erlaubt die Erstellung einer Abstimmung',

    options: [
                {
                    name: "new",
                    description: "Starte eine neue Abstimmung",
                    type: 1,
                    options: [
                        {
                            name: "question",
                            description: "Titel der Abstimmung",
                            type: 3,
                            required: true
                        },
                        {
                            name: "answers",
                            description: "Antworten, die abgegeben werden können. Getrennt per´\"|\" z.B. \"Ja|Nein\"",
                            type: 3,
                            required: true
                        },
                        {
                            name: "minvotes",
                            description: "Mindestanzahl der Antworten, die ein User abgegebn muss. Standard: 1",
                            type: 4,
                            required: false,
                            min_value: 2
                        },
                        {
                            name: "maxvotes",
                            description: "Maximale Anzahl der Antworten, die ein User maximal abgegeben kann. Standard: 1",
                            type: 4,
                            required: false,
                            min_value: 2
                        },
                    ]
                },
                {
                    name: "end",
                    description: "Beende eine Abstimmung",
                    type: 1,
                    options: [
                        {
                            name: "id",
                            description: "ID der Abstimmung, die beendet werden soll",
                            type: 3,
                            required: true
                        },
                    ]
                }

        ],

    permission: ["MANAGE_CHANNELS"],

	async execute(interaction) {

        if (interaction.options.get("question")) {
    
        const question = interaction.options.get("question").value
        const answers = interaction.options.get("answers").value.split("|")


        //create Vote in Database
        const vote = new VOTE({
            question: question,
            answers: answers.map(answer => {return {answer: answer, votes: 0, id: nanoid(5), order: answers.indexOf(answer)}}),
            createdAt: new Date(),
            voted_users: []
        })

        //add minvotes to vote if set
        if (interaction.options.get("minvotes")) {
            vote.minvotes = interaction.options.get("minvotes").value
        }

        //add maxvotes to vote if set
        if (interaction.options.get("maxvotes")) {
            vote.maxvotes = interaction.options.get("maxvotes").value
        }

        
        //save Vote in Database
        vote.save()

        //send message to channel
        interaction.channel.send(votemessagebuilder(vote)).then(message => {
            vote.message = message.id
            vote.channel = message.channel.id
            vote.save()
        })

        //reply interaction
        interaction.reply({ ephemeral: true, content: "Abstimmung erstellt!" })



    } 
    else if (interaction.options.get("id")) {
        //get vote from Database
        VOTE.findOne({_id: interaction.options.get("id").value}, (err, vote) => {
            if (err) {
                interaction.reply({ ephemeral: true, content: "Fehler beim Beenden der Abstimmung!" })
            } else if (vote) {
                //end vote
                vote.closingAt = new Date()
                vote.save()
                interaction.channel.send(votemessagebuilder(vote, true)).then(message => {
                    vote.message = message.id
                    vote.channel = message.channel.id
                    vote.save()

                    //update message
                    interaction.channel.messages.fetch(vote.message).then(message => {
                        message.edit(votemessagebuilder(vote, true))
                    })
                })
                interaction.reply({ ephemeral: true, content: "Abstimmung beendet!" })
            } else {
                interaction.reply({ ephemeral: true, content: "Abstimmung nicht gefunden!" })
            }
        })
    
    }
    },
};