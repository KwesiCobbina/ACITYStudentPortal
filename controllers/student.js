const express = require('express');
const app = express.Router();
const cloudinary = require('cloudinary').v2;
const student = require('../models/studentModel');
const semcourse = require('../models/semCoursesModel');
const courseRegister = require('../models/courseRegisterModel');
const studentScores = require('../models/studentScoresModel');
const { registrationOpen, resultsOpen } = require('../config/authorize');
const { paidfee, fee } = require('../models/feeModel');

app.get('/', (req, res) => {
	console.log(req.session.studentID)
	res.render('students/home');
});

app.get('/profile', (req, res) => {
	let { studentID } = req.session;
	student.findOne({ studentID }).populate("program").then(data => {
		let profilePic = cloudinary.url(data.profilePic);
		res.render('students/profile', { student: data, profilePic });
	})

})



app.get('/registration', registrationOpen, (req, res) => {
	let { studentID } = req.session;
	student.findOne({ studentID }).populate("program").then(sdata => {
		semcourse.find({ "programID": sdata.program, "year": sdata.year, "semester": 1 }).populate([{ path: "lecturer", select: "firstname surname" }, { path: "course" }]).then(resp => {
			courseRegister.findOne({ "studentID": sdata._id, "year": sdata.year, "semester": 1 }).populate("courses").then(cdata => {
				let reg = [];
				if (cdata != null) {
					reg = resp.filter(i => {
						let inn = false;
						cdata.courses.forEach(j => {
							if ((j._id.toString()).trim() == (i.course._id.toString()).trim()) inn = true;
						})
						return inn;
					})
					reg = reg.map(i => {
						return {
							code: i.course.code,
							name: i.course.name,
							credit: i.credit,
							id: i.course._id
						}
					})
				}


				res.render('students/registration', { data: resp, sdata, reg });
			})
		})
	})
})
app.post('/registration', (req, res) => {
	let { studentID } = req.session;
	let regcourses = JSON.parse(req.body.courses);
	regcourses = regcourses.map(i => {
		return i.id;
	})
	student.findOne({ studentID }).then(sdata => {
		// semester has to be the current semester
		courseRegister.update({ "studentID": sdata._id, "program": sdata.program, "year": sdata.year, "semester": 1 }, {
			courses: regcourses
		}, { upsert: true }).then(data => {
			res.json({ done: true })
		})
	})
})

app.get('/unavailable', (req, res) => {
	res.send('This feature hasn\'t been enabled by the staff');
})

app.get('/fees', (req, res) => {
	let { studentID } = req.session;
	student.findOne({ studentID }).then(sdata => {
		paidfee.find({ studentID: sdata._id }).then(fdata => {
			// console.log(fdata);
			fee.find({ program: sdata.program }).then(ffdata => {
				// console.log(ffdata)
				// console.log(sdata.year)
				let totaldue = 0;
				let pfees = 0;
				let amtdue = 0;
				let yy = sdata.year;
				ffdata.forEach(i => {
					totaldue += (i.amount * yy--);
				})
				fdata.forEach(i => {
					pfees += i.amount;
				})
				let balance = pfees - totaldue;
				if (balance >= 0) {
					amtdue = 0;
				} else {
					amtdue = Math.abs(balance);
					balance = 0;
				}
				res.render("students/fees", { fdata, data: { due: totaldue, paid: pfees, balance, amtdue } })
			})
			// res.render("students/fees",{fdata})
		})
	})
})

app.get('/results', resultsOpen, (req, res) => {
	let { studentID } = req.session;
	student.findOne({ studentID }).then(sdata => {
		let yr = sdata.year;
		let data = [];
		for (let i = 1; i <= yr; i++) {
			data.push({
				text: `Year ${i}, Semester 1`,
				url: `results/${i}/1`
			})
			data.push({
				text: `Year ${i}, Semester 2`,
				url: `results/${i}/2`
			})
		}
		res.render('students/results', { data });
	})
})
app.get('/results/:year/:sem', (req, res) => {
	let { year, sem } = req.params;
	let { studentID } = req.session;
	let results = []
	student.findOne({ studentID }).select("_id").then(std => {
		courseRegister.findOne({ studentID: std._id, year, semester: sem }).select("courses").populate("courses").then(regs => {
			studentScores.find({studentID,semester:sem,year}).populate("course").then(stdsc=>{
				let regSet = new Set(regs.courses.map(i=>{
					return {
						id: String(i._id),
						name: i.name
					};
				}));
				console.log(regSet.keys())
				// stdsc.forEach(i=>{
				// 	let courseid = String(i.course._id);
				// 	if(regSet.has(courseid)){
				// 		// set = true and other details
				// 		regSet.delete(courseid);
				// 		results.push({
				// 			set: true,
				// 			course: i.course.name,
				// 			midsem: i.midsem,
				// 			endsem: i.endsem,
				// 			total: i.midsem + i.endsem
				// 		})
				// 	}
				// })
				// res.render('students/resultviewer',{results, unmarked: [...regSet]});
				// // res.json({results, set: [...regSet]})
			})
		})
	})

})

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
})

module.exports = app;