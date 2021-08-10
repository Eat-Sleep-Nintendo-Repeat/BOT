exports.command = {
	name: 'rank',
	call: 'rank',
	description: 'Ein Befehl, der den eigenen Rank als image postet',

    options: [
    {
        name: "user",
        description: "User dessen Rank abgefragt werden soll",
        type: 6,
        required: false
    }],

    permission: [],

	async execute(interaction) {
        const Discord = require("discord.js")
        const puppeteer = require('puppeteer');
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
            await page.goto("http://localhost:7869/rank/" + user, {
                waitUntil: 'networkidle0', // Wait until the network is idle
            });
            var screenshot = await page.screenshot();
            const attachment = new Discord.MessageAttachment(screenshot, `Rankcard von ${user}.png`);
            interaction.editReply({files: [attachment]})
            
          
            await browser.close();
          })();



    },
};