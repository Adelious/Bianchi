const Discord = require("discord.js");
const { commandeCategoryID, commandeArchiveCategoryID, recrutementArchiveCategoryID, recrutementCategoryID, joueurRoleID } = require("../../config.json");
const sqlite3 = require("sqlite3");
const dbname = "main.sqlite";

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

    if (interaction.isButton()) {
      // Ticket de support

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

     

        await channel.send({ embeds: [embed], components: [button] });
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

      // Bouton de verificétion deu règlement 

      if (interaction.customId === "verif") {
        if (!interaction.member.roles.cache.has(joueurRoleID)) {
          await interaction.member.roles.add(joueurRoleID);

          await console.log("Validation du règlement et attribution du rôle joueur pour " + (interaction.member.nickname !== "null" ? interaction.member.nickname : interaction.user.username ))
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

      // Ticket de recrutement 

      if (interaction.customId === "candidature") {

        let channel = await interaction.guild.channels.create({
          name: `candidature-${(interaction.member.nickname !== null) ? interaction.member.nickname.replace(' ', '-') : interaction.user.username }`,
          type: Discord.ChannelType.GuildText,
        });

        await channel.setParent(recrutementCategoryID);

        await channel.permissionOverwrites.create(interaction.user.id, {
          ViewChannel: true,
          EmbedLinks: true,
          SendMessages: true,
          ReadMessageHistory: true,
          AttachFiles: true,
        });

        await interaction.reply({
          content: `Votre candidature a correctement été créé : ${channel}`,
          ephemeral: true,
        });

        await channel.setTopic(interaction.user.id);

        let embed = new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Blue)
          .setTitle("Candidature")
          .setThumbnail(
            interaction.client.user.displayAvatarURL({ dynamic: true })
          )
          .setDescription("création de candidature")
          .setTimestamp()
          .setFooter({
            text: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          });


        const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("close-recrutement")
            .setLabel("fermer la candidature")
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji("🗑️")
        );

        await channel.send({ embeds: [embed], components: [button] });

        channel.send('➔ ** Informations**\n- Nom :\n- Prénom :\n- Âge :\n\n- Temps de jeu (Minimum 100h)( screenshot à l\'appui ) :\n- Image de vos avertissements ( screenshot à l\'appui ) :\n- Disponibilité :\n- Qualité / Défauts :\n\n➔ ** Candidature **\n- Motivations:\n- Pourquoi la Bianchi et pas une autre ? :\n- Pourquoi vous choisir ? :\n- Que représente la Bianchi pour vous ? :\n\n➔ **Information(s) supplémentaire(s) ** :\n- Description de vous ( attitude / conduite / comportement ... ) :')
      }

      if (interaction.customId === "close-recrutement") {
        let user = interaction.client.users.cache.get(
          interaction.channel.topic
        );
        try {
          await user.send("Votre candidature bien a été fermée.");
          await interaction.reply({
            content: "Le candidature a été fermée.",
            ephemeral: true,
          });
        } catch (error) {
          console.log(error);
        }

        await interaction.channel.setParent(recrutementArchiveCategoryID);
      }
    }

    const regex = /^\d+$/; // N'accèpte que les nombres

    // Bouton dépôt d'argent

    if (interaction.customId === "deposit-button") {
      const modal = new Discord.ModalBuilder()
        .setCustomId(`deposit-${interaction.user.id}`)
        .setTitle("Dépôt");

      const montant = new Discord.TextInputBuilder()
        .setCustomId("montant")
        .setLabel("Montant")
        .setMaxLength(6)
        .setStyle(Discord.TextInputStyle.Short);

      const action = new Discord.ActionRowBuilder().addComponents(montant);

      modal.addComponents(action);

      await interaction.showModal(modal);

      const filter = (interaction) =>
        interaction.customId === `deposit-${interaction.user.id}`;

      interaction
        .awaitModalSubmit({ filter, time: 100_000 })
        .then((modalInteraction) => {
          const montant =
            modalInteraction.fields.getTextInputValue("montant");

          if (regex.test(montant)) {
            depositMoney(modalInteraction, interaction.user.id, montant);
          } else {
            modalInteraction.reply({
              content: `\`${montant}\` n'est pas un montant valide`,
              ephemeral: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // Bouton retrait d'argent

    if (interaction.customId === "withdraw-button") {
      const modal = new Discord.ModalBuilder()
        .setCustomId(`withdraw-${interaction.user.id}`)
        .setTitle("Retrait");

      const montant = new Discord.TextInputBuilder()
        .setCustomId("montant")
        .setLabel("Montant")
        .setMaxLength(6)
        .setStyle(Discord.TextInputStyle.Short);

      const action = new Discord.ActionRowBuilder().addComponents(montant);

      modal.addComponents(action);

      await interaction.showModal(modal);

      const filter = (interaction) =>
        interaction.customId === `withdraw-${interaction.user.id}`;

      interaction
        .awaitModalSubmit({ filter, time: 100_000 })
        .then((modalInteraction) => {
          const montant =
            modalInteraction.fields.getTextInputValue("montant");

          if (regex.test(montant)) {
            withdrawMoney(modalInteraction, interaction.user.id, montant);
          } else {
            modalInteraction.reply({
              content: `\`${montant}\` n'est pas un montant valide`,
              ephemeral: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // Bouton création de compte

    if (interaction.customId === "creation-button") {
      await signedInVerification(interaction.user.id, interaction);
    }

    // Bouton d'information

    if (interaction.customId === "info-button") {
      nom = `${await getName(interaction.user.id)}`;
      money =  `${await getMoney(interaction.user.id)}`;

      let embed = await new Discord.EmbedBuilder()
        .setColor(Discord.Colors.Blue)
        .setTitle("creation d'un ticket")
        .setThumbnail(
          interaction.client.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription("ticket créée")
        .addFields(
          {
            name: "Nom",
            value: ( await nom === "" ) ? 'err' : await nom,
          },
          {
            name: "Argent",
            value:( await money === "" ) ? 'err' : await money,
          }
        )
        .setTimestamp()
        .setFooter({
          text: interaction.client.user.username,
          iconURL: interaction.client.user.displayAvatarURL({
            dynamic: true,
          }),
        });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};

async function signedInVerification(discordId, interaction) {
  let db = await new sqlite3.Database(dbname, (err) => {
    if (err) throw err;
  });

  await db.run(
    "CREATE TABLE IF NOT EXISTS bank(discordId VARCHAR(255), name VARCHAR(255), money INT)",
    (err) => {
      if (err) throw err;
    }
  );

  await db.get(
    "SELECT discordId FROM bank WHERE discordId = ?",
    [discordId],
    (err, row) => {
      if (err) {
        db.close();
        throw err;
      }

      if (row) {
        return interaction.reply({
          content: "Vous êtes déjà inscrit",
          ephemeral: true,
        });
      } else {
        showSignModal(interaction);
      }
    }
  );
}

async function InscriptionInDb(name, money, discordId) {
  let db = await new sqlite3.Database(dbname, (err) => {
    if (err) throw err;
  });

  await db.run(
    "INSERT INTO bank(name, money, discordId) VALUES(?, ?, ?)",
    name,
    money,
    discordId
  );

  await db.all("SELECT * FROM bank", (err, data) => {
    if (err) throw err;
  });
}

async function showSignModal(interaction) {
  const modal = new Discord.ModalBuilder()
    .setCustomId(`creation-${interaction.user.id}`)
    .setTitle("Création de compte bancaire");

  const name = new Discord.TextInputBuilder()
    .setCustomId("name")
    .setLabel("Nom")
    .setStyle(Discord.TextInputStyle.Short)
    .setPlaceholder(interaction.user.username);

  const argent = new Discord.TextInputBuilder()
    .setCustomId("money")
    .setLabel("Dépôt d'argent")
    .setMaxLength(8)
    .setStyle(Discord.TextInputStyle.Short);

  const firstActionRow = new Discord.ActionRowBuilder().addComponents(name);
  const secondActionRow = new Discord.ActionRowBuilder().addComponents(argent);

  modal.addComponents(firstActionRow, secondActionRow);

  await interaction.showModal(modal);

  const filter = (interaction) =>
    interaction.customId === `creation-${interaction.user.id}`;

  interaction
    .awaitModalSubmit({ filter, time: 100_000 })
    .then((modalInteraction) => {
      const name = modalInteraction.fields.getTextInputValue("name");
      const money = modalInteraction.fields.getTextInputValue("money");
      const discordId = interaction.user.id;

      InscriptionInDb(name, money, discordId);

      modalInteraction.reply({
        content: `Inscription effectuée avec succès`,
        ephemeral: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

async function depositMoney(modalInteraction, discordId, money) {
  let db = await new sqlite3.Database(dbname, (err) => {
    if (err) throw err;
  });

  await db.get(
    "SELECT money FROM bank WHERE discordId = ?",
    [discordId],
    (err, data) => {
      if (err) throw err;
      var finalMoney = parseInt(money) + parseInt(data.money);
      db.run("UPDATE bank SET money = ? WHERE discordId = ?", [
        finalMoney,
        discordId,
      ]);
      modalInteraction.reply({
        content: `Vous déposez ${money}€`,
        ephemeral: true,
      });
    }
  );
}

async function withdrawMoney(interaction, discordId, money) {
  let db = await new sqlite3.Database(dbname, (err) => {
    if (err) throw err;
  });

  await db.get(
    "SELECT money FROM bank WHERE discordId = ?",
    [discordId],
    (err, data) => {
      if (err) throw err;
      var finalMoney = parseInt(data.money) - parseInt(money);
      if (finalMoney < 0) {
        return interaction.reply({
          content: `Votre argent ne peut pas être dans le négatif.`,
          ephemeral: true,
        });
      }
      interaction.reply({
        content: `Vous retirez ${money}€`,
        ephemeral: true,
      });
      db.run("UPDATE bank SET money = ? WHERE discordId = ?", [
        finalMoney,
        discordId,
      ]);
    }
  );
}

async function getMoney(discordId) {
  return new Promise(async (money) => {
    let db = await new sqlite3.Database(dbname, (err) => {
      if (err) throw err;
    });
    await db.get(
      "SELECT money FROM bank WHERE discordId = ?",
      [discordId],
      (err, data) => {
        if (err) throw err;
        money(data.money);
      }
    );
  });
}

async function getName(discordId) {
  return await new Promise(async (name) => {
    let db = await new sqlite3.Database(dbname, (err) => {
      if (err) throw err;
    });
    await db.get(
      "SELECT name FROM bank WHERE discordId = ?",
      [discordId],
      (err, data) => {
        if (err) throw err;
        name(data.name);
      }
    );
  });
}