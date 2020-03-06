const mongoose = require("mongoose");

const resetRequestSchema = new mongoose.Schema({
    r_id: mongoose.SchemaTypes.ObjectId
});

module.exports = mongoose.model('resetRequest', resetRequestSchema);