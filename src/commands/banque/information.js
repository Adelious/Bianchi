const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("information").setDescription("Création de l'embed d'information bancaire").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Informations bancaire")
      .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
      .setDescription("banque bot")
      .setTimestamp()
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      });

    const infoButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("info-button")
        .setLabel("Informations")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🔎")
    );

    await interaction.reply({ embeds: [embed], components: [infoButton]});
  },
};
