const { EmbedBuilder, Colors, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Savoir le nom de la musique actuelle"),
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
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed
          .setColor(Colors.Red)
          .setDescription("Il n'y a actuellement pas de queue.");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const song = queue.songs[0];
      embed
        .setColor("Blue")
        .setDescription(
          `🎶 **Joue actuellement:** \`${song.name}\` - \`${song.formattedDuration}\`.\n**Liens:** ${song.url}`
        )
        .setThumbnail(song.thumbnail);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log(err);

      embed
        .setColor(Colors.Red)
        .setDescription("\\❌ | Une erreur est survenue...");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
