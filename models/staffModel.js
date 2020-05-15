const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let staffSchema = new Schema({
		firstname: {
			type: String,
			required: true
		},
		surname: {
			type: String, 
			required: true
        },
        staffId: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
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

const staff = mongoose.model('staff', staffSchema);

module.exports = staff;