const { EmbedBuilder, Colors, SlashCommandBuilder } = require("discord.js");
const { getLyrics, getSong } = require("genius-lyrics-api");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Avoir les paroles d'une musique")
    .addStringOption((option) =>
      option
        .setName("music")
        .setDescription("Le nom de la musique")
        .setRequired(false)
    ),
  async execute(interaction) {
    const { options, member, guild, channel, client } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    var musicOptions;

    const embed = new EmbedBuilder();


    musicOptions = {
        apiKey:
          "d92_7V_JIWnu4zGNJtmY8cHvuJZKw_RA21K_Sh67YLdq8PuniTNNZKqfWjPW8hT4",
        title: interaction.options.getString("music"),
        artist: " ",
        optimizeQuery: true,
    };


    if (interaction.options.getString("music") != null) {
      musicOptions = {
        apiKey:
          "d92_7V_JIWnu4zGNJtmY8cHvuJZKw_RA21K_Sh67YLdq8PuniTNNZKqfWjPW8hT4",
        title: interaction.options.getString("music"),
        artist: " ",
        optimizeQuery: true,
      };
    } else {

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

        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
          embed
            .setColor(Colors.Red)
            .setDescription("Il n'y a actuellement pas de queue.");
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const song = queue.songs[0];
        
        musicOptions = {
            apiKey:
              "d92_7V_JIWnu4zGNJtmY8cHvuJZKw_RA21K_Sh67YLdq8PuniTNNZKqfWjPW8hT4",
            title: song.name,
            artist: " ",
            optimizeQuery: true,
          };
    }

    try {
        song = await getSongInformation(musicOptions)
        const lyrics = await song.lyrics;

        await embed.setColor(Colors.Purple)
            .setTitle(song.title)
            .setURL(song.url)
          .setThumbnail(song.albumArt)
          .setDescription(lyrics)
          .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
          });
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (err) {
        console.log(err);
      
        embed.setColor(Colors.Red).setDescription("\\❌ | Une erreur est survenue...");
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
  },
};

async function getSongInformation(options) {
  return new Promise(function (success) {
    getSong(options).then((song) => {
      success(song);
    });
  });
}