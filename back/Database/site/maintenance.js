const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    maintenance: {
        type: Boolean,
        required: true,
        default: false 
    }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);