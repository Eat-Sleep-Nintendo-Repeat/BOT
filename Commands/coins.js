exports.command = {
	name: 'coins',
	call: 'coins',
	description: 'Ein Befehl, der den eigenen Coinstate als image postet',

    options: [
    {
        name: "user",
        description: "User dessen Coins abgefragt werden soll",
        type: 6,
        required: false
    }],

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
            height: 250,
            deviceScaleFactor: 2,
        };

        (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            page.setViewport(viewport)
            await page.goto(`${path.resolve("card_rendering/coins.html")}?user=${user}&api_key=${config["eat-sleep-nintendo-repeat-api"].api_key}&base_url=${config["eat-sleep-nintendo-repeat-api"].base_url}`, {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.MessageAttachment(screenshot, `Coincard von ${user}.png`);
            interaction.editReply({files: [attachment]})
            
          
            await browser.close();
          })();



    },
};