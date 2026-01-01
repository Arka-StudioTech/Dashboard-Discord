const { Events, ActivityType } = require('discord.js');
const connectToDatabase = require('../../Database/Connection');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        // الاتصال بقاعدة البيانات
        try {
            await connectToDatabase();
            console.log('✅ Connected to the database successfully!');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
        }

        client.user.setPresence({ activities: [{ name: '/help', type: ActivityType.Playing }] });
    }
};
