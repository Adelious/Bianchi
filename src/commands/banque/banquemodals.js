const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("banquemodals").setDescription("Création de l'embed de banque").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Banque Bot")
      .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
      .setDescription("Banque")
      .setTimestamp()
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      });

    const withdrawButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("withdraw-button")
        .setLabel("retrait")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("💵")
    );

    const depositButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("deposit-button")
        .setLabel("dépôt")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🏦")
    );

    await interaction.reply({ embeds: [embed], components: [withdrawButton, depositButton]});
  },
};
