const { SlashCommandBuilder } = require('discord.js');
const ServerSettings = require('../../Database/site/maintenance');
const BannedUser = require('../../Database/site/ban.js');
const config = require('../../config.js')
const EXEMPT_USER_ID = config.bot.owners;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check your ping'),

    async execute(interaction) {
        try {
            const maintenance = await ServerSettings.findOne();
            if (maintenance && maintenance.maintenance && interaction.user.id !== EXEMPT_USER_ID) {
                return interaction.reply({ content: '⚠️ The bot is currently in maintenance mode. Please try again later.', ephemeral: true });
            }

            const bannedUser = await BannedUser.findOne({ userId: interaction.user.id });
            if (bannedUser) {
                return interaction.reply({
                    content: `❌ You have been banned from using the bot.\n**Reason:** ${bannedUser.reason}\n\nIf you believe this is a mistake, please contact support: [Support Server](https://discord.gg/YOUR_SUPPORT_LINK)`,
                    ephemeral: true
                });
            }

            const ping = Date.now() - interaction.createdTimestamp;
            await interaction.reply(`🏓 Your ping is **${ping}ms**`);

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ An error occurred while checking the ping.', ephemeral: true });
        }
    }
};
