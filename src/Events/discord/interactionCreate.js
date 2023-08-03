const Discord = require("discord.js");
const { commandeCategoryID } = require("../../config.json");
const { commandeArchiveCategoryID } = require("../../config.json");
const { joueurRoleID } = require("../../config.json");

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing /${interaction.commandName}`);
        console.error(error);
      }
    }

    ////////////////////////////////////////////////////////////////

    if (interaction.isButton()) {
      if (interaction.customId === "ticket") {
        let channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: Discord.ChannelType.GuildText,
        });

        await channel.setParent(commandeCategoryID);

        await channel.permissionOverwrites.create(interaction.user.id, {
          ViewChannel: true,
          EmbedLinks: true,
          SendMessages: true,
          ReadMessageHistory: true,
          AttachFiles: true,
        });

        await interaction.reply({
          content: `Votre ticket a correctement été créé : ${channel}`,
          ephemeral: true,
        });

        await channel.setTopic(interaction.user.id);

        let embed = new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Blue)
          .setTitle("creation d'un ticket")
          .setThumbnail(
            interaction.client.user.displayAvatarURL({ dynamic: true })
          )
          .setDescription("ticket crée")
          .setTimestamp()
          .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          });


        const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("close-ticket")
            .setLabel("fermer le ticket")
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji("🗑️")
        );

     

        await channel.send({ embed: embed, components: [button] });
      }

      if (interaction.customId === "close-ticket") {
        let user = interaction.client.users.cache.get(
          interaction.channel.topic
        );
        try {
          await user.send("Votre ticket a été fermé");
          await interaction.reply({
            content: "Le ticket a été fermé",
            ephemeral: true,
          });
        } catch (error) {
          console.log(error);
        }

        await interaction.channel.setParent(commandeArchiveCategoryID);
      }

      if (interaction.customId === "verif") {
        if (!interaction.member.roles.cache.has(joueurRoleID)) {
          await interaction.member.roles.add(joueurRoleID);

          await interaction.reply({
            content: "Vous venez d'être verifié",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "Vous êtes déjà verifié",
            ephemeral: true,
          });
        }
      }
    }
  },
};
