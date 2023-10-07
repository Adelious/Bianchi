const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const sqlite3 = require("sqlite3");
const dbname = "main.sqlite";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('top')
		.setDescription('Classement des 10 plus riches'),
	async execute(interaction) {
		let classement;

		let db = await new sqlite3.Database(dbname, (err) => {
			if (err) throw err;
		  });
		
		  await db.all("SELECT * FROM bank", (err, data) => {
			if (err) throw err;

			classement = data;

			classement.sort((a, b) => b.money - a.money);

			if(classement.length > 10) {
				classement = classement.slice(0, 10);
			}

			let embed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle("Banque Royale Suisse")
			.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
			.setDescription("Classement")
			.setTimestamp()
			.setFooter({
			  text: interaction.client.user.username,
			  iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
			})
			for (let i = 0; i < classement.length; i++){
				embed.addFields({name: `\`${i+1}.\` ${classement[i].name}`, value: `➥ \`${formaterNombreAvecEspaces(classement[i].money)}\` €`});
			};
	  
		  interaction.reply({ embeds: [embed], ephemeral: true});

		  });
	}
};

function formaterNombreAvecEspaces(nombre) {
    const nombreEnChaine = nombre.toString();
    const nombreFormate = nombreEnChaine.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    return nombreFormate;
}