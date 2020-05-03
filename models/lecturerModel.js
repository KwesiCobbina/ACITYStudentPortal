const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let lecturerSchema = new Schema({
		firstname: {
			type: String,
			required: true
		},
		surname: {
			type: String, 
			required: true
		},
		lecturerID: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true
		},
		mobile: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		profilePic: {
			type: String,
			required: false,
			default: "l06vu2fyqk6yjsayry6l"
		}
});

const lecturer = mongoose.model('lecturer', lecturerSchema);

module.exports = lecturer;