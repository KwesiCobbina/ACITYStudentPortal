const mongoose = require('mongoose');
const student = require('../models/studentModel');

const Schema = mongoose.Schema;

let feeSchema = new Schema({
    program: {
        type: Schema.Types.ObjectId,
        ref: 'program',
        required: true
    },
    continuous: {
        type: Boolean,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

async function doer(ids){
    let result = await student.find({ studentID: { $in: ids } }, "studentID year");
    // let resultIds = result.map(x => {x._id,x.year,x.studentID});
    // console.log(resultIds)
    let resultIds = result.map(x=>x.studentID);    
    let missing = ids.filter(id => resultIds.indexOf(id+"") === -1);
        if(missing.length){
            return {valid: false, missing};
        }
        return {valid: true, found: result};
    }

feeSchema.static('validateIds', doer)

let paidfeeSchema = new Schema({
    studentID: {
        type: Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }

})

feeSchema.pre('save', function(next){
    next();
})

let fee = mongoose.model('fee', feeSchema);
let paidfee = mongoose.model('paidfee', paidfeeSchema);

module.exports = {
    fee,
    paidfee
}