const {
  Events,
  ChannelType,
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");
const { welcomeChannelID } = require("../../config.json");
const { commandeCategoryID } = require("../../config.json");
const sqlite3 = require("sqlite3");
const dbname = "main.sqlite";

(module.exports = {
  name: Events.GuildMemberAdd,
  once: true,
  execute: async (member) => {
    // Changement de nom discord en le nom et prénom RP in game
    const apiURL = "https://api.simple-roleplay.fr/public/user.php";

    var nom;

    try {
      const response = await axios.get(apiURL, {
        params: {
          id: member.id,
        },
      });

      if (response && response.data) {
        const { name } = response.data;
        if (name && name.trim() !== "") {
          member.setNickname(name, "Renamed");
          nom = name;
          console.log(
            `${member.user.username} a rejoint le serveur et à été nommé ${name}.`
          );
        } else {
          member.setNickname("Pas de nom RP.", "Renamed");
        }
      }
    } catch (error) {
      console.error(
        "Error occurred while fetching data from the API : L'utilisateur n'a pas d'identifiants discord associé ou ",
        error
      );
      member.user.send(
        ":x: Je ne parviens pas à vous assigner le nom et prénom RP sur le serveur.\nJe vous ai donc ouvert un ticket pour régler cela avec l'administration."
      );

      // Création d'un ticket
      let ticketChannel = await member.guild.channels.create({
        name: `ticket-auto-${member.user.username}`,
        type: ChannelType.GuildText,
      });

      await ticketChannel.setParent(commandeCategoryID);

      await ticketChannel.permissionOverwrites.create(member.user.id, {
        ViewChannel: true,
        EmbedLinks: true,
        SendMessages: true,
        ReadMessageHistory: true,
        AttachFiles: true,
      });

      await ticketChannel.setTopic(member.user.id);

      let embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle("creation d'un ticket")
        .setThumbnail(
          member.guild.client.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription("ticket créé")
        .setTimestamp()
        .setFooter({
          text: member.guild.client.user.username,
          iconURL: member.guild.client.user.displayAvatarURL({
            dynamic: true,
          }),
        });

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close-ticket")
          .setLabel("fermer le ticket")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🗑️")
      );

      await ticketChannel.send({ embed: embed, components: [button] });

      ticketChannel.send(
        `Ticket automatique ouvert. \nJe ne parviens pas a assigner le nom et prénom de <@${member.user.id}> !`
      );
    }

    console.log(
      `${member.user.username} a rejoint le serveur mais n'a pas pu être nommé.`
    );

    // Message de bienvenue
    if (welcomeChannelID !== "") {
      channel = await member.guild.channels.cache.get(welcomeChannelID);
      await channel.send(
        `\:wave: Bienvenue **<@${member.user.id}>** dans la **Bianchi**`
      );
    }
  }
});