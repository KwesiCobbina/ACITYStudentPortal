const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let courseSchema = new Schema({
	code: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('course', courseSchema);