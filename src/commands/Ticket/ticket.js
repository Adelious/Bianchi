const { MessageAttachment, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder().setName("ticket").setDescription("Création de l'embed de ticket"),
  async execute(interaction) {
    if (!interaction.guild.members.cache.get(interaction.user.id).permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: 'Vous ne pouvez pas utiliser cette commande', ephemeral: true});
    let embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("Banque Bot")
      .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
      .setDescription("Ouverture d'un ticket")
      .setTimestamp()
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket")
        .setLabel("Créer un ticket")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("📩")
    );

    await interaction.reply({ embeds: [embed], components: [button]});
  },
};
