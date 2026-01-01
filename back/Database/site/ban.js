const mongoose = require('mongoose');

const bannedUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    reason: { type: String, default: 'No reason provided' },
    bannedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BannedUser', bannedUserSchema);
