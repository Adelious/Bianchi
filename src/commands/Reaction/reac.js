const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verif")
    .setDescription("Envoie du bouton de verif"),
  async execute(interaction) {
    if (!interaction.guild.members.cache.get(interaction.user.id).permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: 'Vous ne pouvez pas utiliser cette commande', ephemeral: true});
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
