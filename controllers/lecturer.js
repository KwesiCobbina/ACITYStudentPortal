const express = require('express');
const app = express.Router();
const cloudinary = require('cloudinary').v2;
const semCourses = require('../models/semCoursesModel');
const lecturer = require('../models/lecturerModel');
const student = require('../models/studentModel');
const courseRegister = require('../models/courseRegisterModel');
const programm = require('../models/programModel');
const courses = require('../models/courseModel');
const studentScores = require('../models/studentScoresModel');

app.get('/',(req,res)=>{
    res.render("lecturer/home")
})

app.get('/profile',(req,res)=>{
    let {lecturerID} = req.session;
    lecturer.findOne({lecturerID}).then(data=>{
        console.log(data)
        let profilePic = cloudinary.url(data.profilePic);
        res.render('lecturer/profile', {lecturer: data,profilePic});
    })
})

app.get('/grader', (req,res)=>{
    let {program, course} = req.query;
    programm.findOne({code: program}).then(pdata=>{
        courses.findOne({code: course}).then(cdata=>{
            courseRegister.find({"program": pdata._id, courses: {$in: [cdata._id]}}).populate("studentID").then(data=>{
                // console.log(data)
                if(data.length<1){
                    move(req,res,{data: false,courseID: cdata._id})
                }else{
                    // console.log("herre")
                    let c = 0;
                let ress = [];
                // console.log(data)
                data.forEach((i,e)=>{
                    i = i.toObject();
                    i.midsem = null;
                    i.endsem = null;
                    studentScores.findOne({studentID: i.studentID.studentID,course: cdata._id,semester:1}).then(scdata=>{
                        if(scdata){
                            i.midsem = scdata.midsem;
                        i.endsem = scdata.endsem;
                        }
                        
                        c++;
                        ress.push(i);
                        if(c==data.length) move(req,res,{data:ress,courseID: cdata._id})
                    }).catch(console.error)
                    // if(e==data.length-1){
                    //     console.log(data)
                    //     res.render("lecturer/grader", {data,courseID: cdata._id});
                    // }
                })
                
                
                }
                
            })
        })
        
    })
})

function move(req,res,data){
    res.render("lecturer/grader", data)
}

app.post('/grader', (req,res)=>{
    let body = JSON.parse(req.body.data);
    let courseID = body[0].value;
    let year = body[1].value;
    body.forEach(function(i,e){
        if(e>1){
            let sp = i.name.split("_");
            let id = sp[0];
            let isMid = sp[1] == "mid";
            let val = i.value;
            console.log(isMid)
            // Semester number has to be retrieved
            if(isMid){
                studentScores.update({studentID: id, year, course: courseID,semester:1},{
                    "midsem": val
                },{upsert: true}).then(console.log).catch(console.error);
            }else{
                studentScores.update({studentID: id, year, course: courseID,semester:1},{
                    "endsem": val
                },{upsert: true}).then(console.log).catch(console.error);
            }
        }
        if(e==body.length-1){
            res.json({done: true});
        }
        
    })
})

app.get('/classes', (req,res)=>{
    lecturer.findOne({lecturerID: req.session.lecturerID}).then(ldata=>{
        //semester has to be set here
        semCourses.find({lecturer: ldata._id, semester: 1}).populate("course programID").then(data=>{
            res.render("lecturer/classes", {data})
        })
    })
    
})

app.get('/studentsearch', (req,res)=>{
    res.render("staff/studentsearch");
})

app.get('/logout', (req,res)=>{
    delete req.session.lecturer;
    delete req.session.lecturerID;
    res.redirect('/login');
})

module.exports = app;