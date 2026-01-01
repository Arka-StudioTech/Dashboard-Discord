const { SlashCommandBuilder } = require('discord.js');
const ServerSettings = require('../../Database/site/maintenance');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmaintenance')
        .setDescription('Change the maintenance status of the server')
        .addBooleanOption(option =>
            option.setName('maintenance')
                .setDescription('Toggle maintenance mode')
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.user.id !== config.bot.owners) {
            return interaction.reply({ content: '🚫 You do not have permission to use this command.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const maintenance = interaction.options.getBoolean('maintenance');

        try {
            await ServerSettings.findOneAndUpdate(
                {},
                { maintenance: maintenance },
                { upsert: true, new: true }
            );

            await interaction.editReply(`🔧 Maintenance mode set to: ${maintenance ? '✅ Enabled' : '❌ Disabled'}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ An error occurred while setting the maintenance mode.');
        }
    },
};
