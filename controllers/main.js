const express = require('express');
const router = express.Router();
const {notLoggedIn} = require('../config/authorize');
const student = require('../models/studentModel');
const lecturer = require('../models/lecturerModel');
const cloudinary = require('cloudinary').v2;

router.get('/', (req,res)=>{
    res.render('index');
})

router.get('/login', notLoggedIn, (req,res)=>{
    res.render("login");
})

router.post('/studentsearch', (req,res)=>{
    let {name} = req.body;
    student.find({$or: [{
        firstname: { $regex: new RegExp("^" + name.toLowerCase(), "i") }
    },{
        surname: { $regex: new RegExp("^" + name.toLowerCase(), "i") }
    },{
        studentID: { $regex: new RegExp("^" + name.toLowerCase(), "i") }
    }]},"studentID firstname surname").then(data=>{
        res.json(data);
    })
})

router.get('/studentviewer/:studentID', (req,res)=>{
    let {studentID} = req.params;
    student.findOne({studentID}).populate("program").then(data=>{
		let profilePic = cloudinary.url(data.profilePic);
		res.render('students/profile', {student: data,profilePic});
	})
})

router.get('/lecturerviewer/:lecturerID', (req,res)=>{
    let {lecturerID} = req.params;
    lecturer.findOne({lecturerID}).then(data=>{
		let profilePic = cloudinary.url(data.profilePic);
		res.render('lecturer/profile', {lecturer: data,profilePic});
	})
})

module.exports = router;