exports.command = {
	name: 'ranklist',
	call: 'ranklist',
	description: 'Ein Befehl, der eine übersicht der Top-10 ranking user postet',

    options: [],

    permission: [],

	async execute(interaction) {
        const Discord = require("discord.js")
        const puppeteer = require('puppeteer');
        await interaction.deferReply({ ephemeral: false })

        //Making Screenshot
        const viewport = {
            width: 850,
            height: 580,
        };

        (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            page.setViewport(viewport)
            await page.goto("http://localhost:7869/ranklist", {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.MessageAttachment(screenshot, `Ranklist.png`);
            interaction.editReply({files: [attachment]})
            
          
            await browser.close();
          })();



    },
};