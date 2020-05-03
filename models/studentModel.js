const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

let studentSchema = new Schema({
		firstname: {
			type: String,
			required: true
		},
		surname: {
			type: String, 
			required: true
		},
		studentID: {
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
		program: {
			type: Schema.Types.ObjectId,
			ref: 'program'
		},
		password: {
			type: String,
			required: true
		},
		year: {
			type: Number,
			required: true 
		},
		profilePic: {
			type: String,
			required: false,
			default: "l06vu2fyqk6yjsayry6l"
		}
});

// studentSchema.pre('save', function(next){
// 	bcrypt.hash(this.password, 10, function(err, hash) {
// 		this.password = hash;
// 		next();
// 	});
// })

const student = mongoose.model('students', studentSchema);

module.exports = student;