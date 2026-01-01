const mongoose = require("mongoose");
const config = require("../config");

module.exports = async () => {
    try {
        await mongoose.connect(config.bot.mongourl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoose.connection.once('open', () => {
            console.log("✅ Connected to MongoDB!");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ MongoDB Connection Error:", err);
        });

    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
    }
};
