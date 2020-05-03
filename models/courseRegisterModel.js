const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let courseRegisterSchema = new Schema({
    studentID: {
        type: Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    program: {
        type: Schema.Types.ObjectId,
        ref: 'program',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    }]
});

module.exports = mongoose.model('courseRegister', courseRegisterSchema);