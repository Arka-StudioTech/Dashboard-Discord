const { SlashCommandBuilder } = require('discord.js');
const BannedUser = require('../../Database/site/ban.js');
const config = require('../../config.js')
const BOT_OWNER_ID = config.bot.owners; 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('banuser')
        .setDescription('Ban a user from using the bot')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false)),

    async execute(interaction) {
        if (interaction.user.id !== BOT_OWNER_ID) {
            return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot ban yourself!', ephemeral: true });
        }

        try {
            const existingBan = await BannedUser.findOne({ userId: user.id });

            if (existingBan) {
                return interaction.reply({ content: `⚠️ This user is already banned!`, ephemeral: true });
            }

            await BannedUser.create({ userId: user.id, reason });

            interaction.reply(`✅ **${user.tag}** has been banned from using the bot. Reason: **${reason}**`);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ An error occurred while banning the user.', ephemeral: true });
        }
    }
};
