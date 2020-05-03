function studentLoggedIn(req,res,next){
    if(req.session.student)
        return next();
    res.redirect('/login');
}

function staffLoggedIn(req,res,next){
    if(req.session.staff)
        return next();
    res.redirect('/login');
}

function lecturerLoggedIn(req,res,next){
    if(req.session.lecturer)
        return next();
    res.redirect('/login');
}

function notLoggedIn(req,res,next){
    let {student,lecturer,staff} = req.session;
    if(student) res.redirect('/student');
    else if(lecturer) res.redirect('/lecturer');
    else if(staff) res.redirect('/staff');
    else return next();
}

const config = require('../models/configModel');
async function registrationOpen(req,res,next){
    config.findOne({metaname: 'registration'}).then(resp=>{
        if(!resp.metaval) res.redirect('/student/unavailable');
        else next();
    })
}

async function resultsOpen(req,res,next){
    config.findOne({metaname: 'result'}).then(resp=>{
        if(!resp.metaval) res.redirect('/student/unavailable');
        else next();
    })
}


// results has to be authorized

module.exports = {
    studentLoggedIn,
    staffLoggedIn,
    lecturerLoggedIn,
    notLoggedIn,
    registrationOpen,
    resultsOpen
}