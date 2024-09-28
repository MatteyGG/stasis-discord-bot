const { Events } = require('discord.js');
const moment = require('moment'); // To install moment, execute npm install moment

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(interaction, client) {
        console.log(`${interaction.user.username} joined the server at ${moment(interaction.member.joinedAt).format('LLLL')}`);
    }
};