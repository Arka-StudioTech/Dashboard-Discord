const { SlashCommandBuilder } = require('discord.js');
const BannedUser = require('../../Database/site/ban.js');
const config = require('../../config.js'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unbanuser')
        .setDescription('Unban a user from using the bot')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unban')
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.user.id !== config.bot.owners) {
            return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        try {
            const ban = await BannedUser.findOneAndDelete({ userId: user.id });

            if (!ban) {
                return interaction.reply({ content: `⚠️ This user is not banned!`, ephemeral: true });
            }

            interaction.reply(`✅ **${user.tag}** has been unbanned.`);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ An error occurred while unbanning the user.', ephemeral: true });
        }
    }
};
