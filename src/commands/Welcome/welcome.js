const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("set the welcome channel"),
  async execute(interaction) {
    const filePath = path.join(__dirname, "../../config.json");
    const data = fs.readFileSync(filePath);
    const json = JSON.parse(data);
    json.welcomeChannelID = interaction.channel.id;
    const updatedData = JSON.stringify(json, null, 2);
    await fs.writeFileSync(filePath, updatedData);
    await interaction.reply({
      content: `Welcome channel set to \`${interaction.channel.name}\``,
      ephemeral: true,
    });
  },
};
