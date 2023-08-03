const { EmbedBuilder, Colors, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Jouer une musique.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Fournire le nom ou l'url de la musique.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel, client } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor(Colors.Red)
        .setDescription(
          "\\❌ Vous devez être dans un salon vocal pour executer la commande."
        );
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor(Colors.Red)
        .setDescription(
          `\\❌ Vous ne pouvez pas utiliser cette commande car je suis déjà occupé dans <${guild.members.me.voice.channelId}>.`
        );
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    try {
      client.distube.play(voiceChannel, query, {
        textChannel: channel,
        member: member,
      });
      return interaction.reply({
        content: "\\🎵 En cours d'envoie.",
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);

      embed
        .setColor(Colors.Red)
        .setDescription("\\❌ | Une erreur est survenue...");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
