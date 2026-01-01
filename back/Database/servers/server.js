// Database/servers/server.js
const mongoose = require('mongoose');

const serverConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  // يمكنك إضافة حقول إضافية هنا حسب احتياجاتك، على سبيل المثال:
  config: { type: mongoose.Schema.Types.Mixed, default: {} }
});

module.exports = mongoose.model("ServerConfig", serverConfigSchema);
