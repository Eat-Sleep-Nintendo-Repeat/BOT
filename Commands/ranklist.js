exports.command = {
	name: 'ranklist',
	call: 'ranklist',
	description: 'Ein Befehl, der die Top 10 User anhand ihrer Ränge postet',

    permission: [],

	async execute(interaction) {
        const Discord = require("discord.js")
        const puppeteer = require('puppeteer');
        var path = require("path")
        var config = require("../config.json")
        await interaction.deferReply({ ephemeral: false })

        //Making Screenshot
        var user = interaction.user.id
        if (interaction.options.get("user")){
           user = interaction.options.get("user").value 
        }

        const viewport = {
            width: 700,
            height: 700,
            deviceScaleFactor: 2,
        };

        (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            page.setViewport(viewport)
            await page.goto(`${path.resolve("card_rendering/ranklist.html")}?api_key=${config["eat-sleep-nintendo-repeat-api"].api_key}&base_url=${config["eat-sleep-nintendo-repeat-api"].base_url}`, {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.MessageAttachment(screenshot, `Ranklist.png`);
            interaction.editReply({files: [attachment]})
            
          
            await browser.close();
          })();



    },
};