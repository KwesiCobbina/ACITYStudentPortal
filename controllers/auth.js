const express = require('express');
const router = express.Router();
const student = require('../models/studentModel');
const lecturer = require('../models/lecturerModel');

router.post('/login', (req,res)=>{
    const { type, userID, userPass } = req.body;
    if(type==1){
        // do student login
        console.log(req.body)
        student.findOne({studentID: userID, password: userPass}).then(data=>{
            console.log(data)
            if(data){
                req.session.student = true;
                req.session.studentID = userID;
                res.json({done: true, msg: `Welcome ${data.firstname}`});
            }else{
                res.json({done: false, msg: `Invalid student details`});
            }
        })
    }else if(type==2){
        // do lecturer
        console.log(req.body);
        lecturer.findOne({lecturerID: userID, password: userPass}).then(data=>{
            console.log(data)
            if(data){
                req.session.lecturer = true;
                req.session.lecturerID = userID;
                res.json({done: true, msg: `Welcome ${data.firstname}`});
            }else{
                res.json({done: false, msg: `Invalid lecturer details`});
            }
        })
    }else{
        // do staff 
        console.log("staff")
        req.session.staff = true;
        req.session.staffID = userID;
		res.json({done: true, msg: `Welcome Staff memeber`});
    }
})

module.exports = router; 