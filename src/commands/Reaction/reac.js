const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verif")
    .setDescription("Envoie du bouton de verif"),
  async execute(interaction) {
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verif")
        .setLabel("Approuver")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✔️")
    );

    await interaction.channel.send({components: [button]});
    await interaction.reply({content:'Boutton de verif envoyé!', ephemeral: true});
  },
};
