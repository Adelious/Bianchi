const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await console.log(`Ready! Logged in as ${client.user.tag}`);

		await client.user.setPresence({
			activities: [{
				name: 'Simple Roleplay',
				type: ActivityType.Playing,
			}],
			status: 'dnd',
		  })
	},
};
