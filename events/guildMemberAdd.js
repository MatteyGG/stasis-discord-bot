const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(interaction) {
        console.log(`${interaction.user.username} joined the server!`);
        
    }
};