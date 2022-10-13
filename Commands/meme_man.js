exports.command = {
  name: "mememan",
  call: "fock",
  description: "Meme Man with your caption",

  options: [
    {
      name: "title",
      description: "your caption",
      type: 3,
      required: true,
    },
  ],

  permission: [],

  async execute(interaction) {
    const Discord = require("discord.js");
    const puppeteer = require("puppeteer");
    var path = require("path");
    var config = require("../config.json");
    await interaction.deferReply({ ephemeral: false });

    //Making Screenshot
    const viewport = {
      width: 720,
      height: 450,
      deviceScaleFactor: 2,
    };

    (async () => {
      const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
      const page = await browser.newPage();
      page.setViewport(viewport);
      await page.goto(`file:///${path.resolve("card_rendering/meme man.html")}?title=${interaction.options.get("title").value}`, {
        waitUntil: "networkidle0", // Wait until the network is idle
      });
      var screenshot = await page.screenshot();
      const attachment = new Discord.MessageAttachment(screenshot, `Mememan.png`);
      interaction.editReply({ files: [attachment] });

      await browser.close();
    })();
  },
};
