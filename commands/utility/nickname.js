const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Changes the nickname of the user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user whose nickname to change')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('nickname')
                .setDescription('The new nickname')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const nickname = interaction.options.getString('nickname');
        await interaction.client.user.setUsername(nickname);
        await interaction.reply(`Changed nickname of ${user.username} to ${nickname}`);
    }
    
}