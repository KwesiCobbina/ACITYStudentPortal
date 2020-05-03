const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let configSchema = new Schema({
    metaname: String,
    metaval: Boolean
})

module.exports = mongoose.model('config', configSchema);