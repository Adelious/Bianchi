const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ouverture").setDescription("Création de l'embed d'ouverture de compte").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Banque Bot")
      .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
      .setDescription("Ouverture de compte")
      .setTimestamp()
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      });

    const OpenButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("creation-button")
        .setLabel("Création")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("💳")
    );

    await interaction.reply({ embeds: [embed], components: [OpenButton]});
  },
};
