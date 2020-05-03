const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let semCourseSchema = new Schema({
    programID: {
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
    course: {
        type: String,
        required: true,
        ref: 'course'
    },
    credit: {
        type: Number,
        required: true
    },
    lecturer: {
        type: String,
        required: true,
        ref: 'lecturer'
    }
})

module.exports = mongoose.model('semCourse', semCourseSchema);