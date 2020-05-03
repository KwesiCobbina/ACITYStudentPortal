const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let programSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true
	},
	years: {
		type: Number,
		required: true
	}
})

module.exports = mongoose.model('program', programSchema);