const { EmbedBuilder, Colors, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forward")
    .setDescription("Passe un certain temps de la musique.")
    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("Seconds qui doivent être ignorées ( 10 = 10s ).")
        .setMinValue(0)
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel, client } = interaction;

    const query = options.getString("query");
    const seconds = options.getInteger("seconds");
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

      await queue.seek(queue.currentTime + seconds);
      embed
        .setColor("Blue")
        .setDescription(`⏩ Musique avancée de \`${seconds}s\`.`);
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
