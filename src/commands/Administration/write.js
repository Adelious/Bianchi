const { SlashCommandBuilder, messageLink } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("write")
    .setDescription("le bot écrit le message")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("le message à écrire")
        .setRequired(true)
    ),
  async execute(interaction) {
    message = interaction.options
      .getString("message")
      .replace(/<br\s*[\/]?>/gi, "\n");
    await interaction.channel.send(message);
    await interaction.reply({ content: "Message envoyé", ephemeral: true });
  },
};
