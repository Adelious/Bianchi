const { EmbedBuilder, Colors, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("loop options.")
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Loop options: off, musique, fil d'attente")
        .addChoices(
          { name: "off", value: "off" },
          { name: "musique", value: "musique" },
          { name: "fil d'attente", value: "fil d'attente" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel, client } = interaction;

    const query = options.getString("query");
    const option = options.getString("options");
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

      let mode = null;

      switch (option) {
        case "off":
          mode = 0;
          break;
        case "song":
          mode = 1;
          break;
        case "queue":
          mode = 2;
          break;
      }

      mode = await queue.setRepeatMode(mode);

      mode = mode ? (mode === 2 ? "loop queue" : "loop musique") : "Off";

      embed.setColor("Orange").setDescription(`🔁 Mode deloop \`${mode}\`.`);
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
