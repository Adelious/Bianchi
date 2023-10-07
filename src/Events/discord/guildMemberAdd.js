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

    // Banque Bot

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
          const montant = modalInteraction.fields.getTextInputValue("montant");

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
          const montant = modalInteraction.fields.getTextInputValue("montant");

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

    // Bouton prêt d'argent

    if (interaction.customId === "loan-button") {
      const modal = new Discord.ModalBuilder()
        .setCustomId(`loan-${interaction.user.id}`)
        .setTitle("Prêt");

      const montant = new Discord.TextInputBuilder()
        .setCustomId("montant")
        .setLabel("Montant")
        .setMaxLength(6)
        .setStyle(Discord.TextInputStyle.Short);

      const capital = new Discord.TextInputBuilder()
        .setCustomId("capital")
        .setLabel("Capital")
        .setPlaceholder("Ce que vous possedez")
        .setStyle(Discord.TextInputStyle.Paragraph);

      const firstActionRow = new Discord.ActionRowBuilder().addComponents(
        montant
      );
      const secondActionRow = new Discord.ActionRowBuilder().addComponents(
        capital
      );

      modal.addComponents(firstActionRow, secondActionRow);

      await interaction.showModal(modal);

      const filter = (interaction) =>
        interaction.customId === `loan-${interaction.user.id}`;

      interaction
        .awaitModalSubmit({ filter, time: 100_000 })
        .then((modalInteraction) => {
          const montant = modalInteraction.fields.getTextInputValue("montant");

          if (regex.test(montant)) {
            modalInteraction.reply({
              content: `Vous demandez ${montant}€`,
              ephemeral: true,
            });
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
      money = `${await getMoney(interaction.user.id)}`;

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
            value: (await nom) === "" ? "err" : await nom,
          },
          {
            name: "Argent",
            value: (await money) === "" ? "err" : await money,
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
}),
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
  };

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
      console.log(finalMoney);
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
      console.log(finalMoney);
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
