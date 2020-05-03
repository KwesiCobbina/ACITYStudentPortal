const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let studentScoreSchema = new Schema({
    studentID: {
        type: String,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course'
    },
    semester: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    midsem: {
        type: Number,
    },
    endsem: {
        type: Number
    }
})

let studentScoreModel = mongoose.model('studentScore', studentScoreSchema);

module.exports = studentScoreModel;