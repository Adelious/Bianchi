const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "mute",
  description: "mute un membre",
  permission: Discord.PermissionFlagsBits.ModerateMembers,
  dm: false,
  options: [
    {
      type: "user",
      name: "membre",
      description: "membre à mute",
      required: true,
    },
    {
      type:"string",
      name: "temps",
      description: "temps du mute",
      required: true,
    },
    {
      type: "string",
      description: "raison du mute",
      name: "raison",
      required: false,
    },
  ],

  async run(client, message, args) {
    let user = args.getUser("membre");
    if (!user) return message.reply("Pas de membre à mute !");

    let member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("Membre introuvable");

    let time = args.getString("temps");
    if(!time) return message.reply("Pas de temps à mute!");
    if(isNaN(ms(time))) return message.reply("Pas le bon format");
    if(ms(time) < 86400000 ) return message.reply("Le mute ne doit pas durer plus de 28 jours!");

    let reason = args.getString("raison");
    if(!reason) reason = "Aucune raison fournie";

    if (message.user.id === user.id) return message.reply("Vous ne pouvez pas vous mute tout seul!");
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Vous ne pouvez pas mute ce membre!");
    if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Vous ne pouvez mute le propriétaire du serveur");
    if (member.moderatable) return message.reply("Vous ne pouvez pas mute ce membre!");

    if (member.isCommunicationDisabled()) return message.reply("Ce membre est déjà mute");

    try {
        await user.send(
          `Tu as été mute du serveur ${message.guild.name} par ${message.user.tag}, pendant ${time} pour la raison : \`${reason}\``
        );
      } catch (err) {}
  
      await message.reply(
        `${message.user} a mute ${user.tag}, pendant ${time} pour la raison : \`${reason}\``
      );
  
      await member.timeout(ms(time), reason);
  },
};
