const express = require('express');
const app = express.Router();
const rs = require('randomstring');
const program = require('../models/programModel');
const course = require('../models/courseModel');
const student = require('../models/studentModel');
const lecturer = require('../models/lecturerModel');
const semcourse = require('../models/semCoursesModel');
const {fee, paidfee} = require('../models/feeModel');
const config = require('../models/configModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = require('../config/upload');
const fs = require('fs');
const nodeXLS = require('node-xlsx');

app.get('/', (req,res)=>{
	let bins = {registration: false, result: false};
	config.find({}).then(resp=>{
		if(resp){
			resp.forEach(i=>{
				bins[i.metaname] = i.metaval;
			})
		}
		res.render('staff/home', {bins});
	})
})

app.get('/studentsearch',(req,res)=>{
	res.render('staff/studentsearch');
})

app.get('/programs', (req,res)=>{
	program.find({}).then(data=>{
		res.render('staff/programs', {data});
	})
})
app.post('/programs', (req,res)=>{
	// add new program
	req.body.code = req.body.code.toUpperCase();
	let nProgram = new program(req.body);
	nProgram.save().then(sdata=>{
		new fee({
			program: nProgram._id,
			continuous: false,
			amount: 0
		}).save();
		new fee({
			program: nProgram._id,
			continuous: true,
			amount: 0
		}).save();
		res.redirect('/staff/programs');
	});
	
})

app.get('/courses', (req,res)=>{
	course.find({}).then(data=>{
		res.render('staff/courses', {data});
	})
})
app.post('/courses', (req,res)=>{
	// add new program
	let nCourses = new course(req.body);
	nCourses.save();
	res.redirect('/staff/courses');
})

app.get('/students', (req,res)=>{
	program.find({}).then(pdata=>{
		student.find({}).populate("program").then(data=>{
			//console.log(data)
			let id = Math.floor(Math.random()*10000000);
			let pass = (rs.generate(7)).toLowerCase();
			
			res.render('staff/students', {data, pdata, pd: {id, pass}});
		})
	})
	
})
app.post('/students', upload.single('pic'), (req,res)=>{
	// add new student
	
	
	cloudinary.uploader.upload(req.file.path,(err,result)=>{
		if(err) throw err;
		req.body.profilePic = result.public_id;
		let nStudent = new student(req.body);
		nStudent.save();
		res.redirect('/staff/students');
	})
	
})

app.get('/lecturers', (req,res)=>{
		lecturer.find({}).then(data=>{
			let id = Math.floor(Math.random()*10000000);
			let pass = (rs.generate(7)).toLowerCase();
			res.render('staff/lecturers', {data, pd: {id, pass}});
		})
	
})
app.post('/lecturers', upload.single('pic'), (req,res)=>{
	// add new student
	cloudinary.uploader.upload(req.file.path, (err,result)=>{
		if(err)throw err;
		req.body.profilePic = result.public_id;
		let nLecturer = new lecturer(req.body);
		nLecturer.save();
		res.redirect('/staff/lecturers');
	})
	
})

// takes query program code and year
app.get('/semviewer', (req,res,next)=>{
	let {code, year} = req.query;
	program.findOne({code}).then(data=>{
		semcourse.find({programID: data._id, year, semester: 1}).populate("course").populate("lecturer").then(sem1res=>{
			semcourse.find({programID: data._id, year, semester: 2}).populate("course").populate("lecturer").then(sem2res=>{
				res.render('staff/semviewer', {data,code,year,sem1res, sem2res});
			})
		})
	})
})

app.get('/semcourses', (req,res)=>{
	let {code, year} = req.query;
	course.find({}).then(cdata=>{
		lecturer.find({}).then(ldata=>{
			program.findOne({code}).then(data=>{
				semcourse.find({programID: data._id, year, semester: 1}).populate("course").populate("lecturer").then(sem1res=>{
					semcourse.find({programID: data._id, year, semester: 2}).populate("course").populate("lecturer").then(sem2res=>{
						res.render('staff/semcourses', {data,code,year,cdata,ldata,sem1res, sem2res});
					})
				})
			})
		})
	})
	
})
app.post('/semcourses', (req,res)=>{
	let body = JSON.parse(req.body.data);
	body.forEach((i,ind)=>{
				// update or insert
				console.log(i)
				course.findOne({code: i.course}).then(cdata=>{
					lecturer.findOne({lecturerID: i.lecturer}).then(ldata=>{
						semcourse.update({"year": i.year, "semester": i.semester, "programID": i.programID, "course": cdata._id},{$set: {
							credit: i.credit, lecturer: ldata._id
						}},{upsert: true}).then(console.log).catch(console.error);
					})
				})
				
				if(ind==body.length-1){
					res.send({done: true});
				}
	})
})

app.get('/fees', (req,res)=>{
	res.render("staff/fees")
})

app.get('/setfees', (req,res)=>{
	fee.find({continuous: true}).populate("program").then(cdata=>{
		fee.find({continuous: false}).populate("program").then(fdata=>{
			res.render("staff/setfees", {fdata, cdata})
		})
		
	})
	
})

app.post('/setfees/:opt',(req,res)=>{
	let continuous = true;
	if(req.params.opt=="fresh") continuous = false;
	let data = JSON.parse(req.body.data);
	console.log(data)
	data.forEach((i,e)=>{
		fee.update({"program": i.name, "continuous": continuous},
		{$set: {amount: i.value}},{upsert: true}).then(console.log).catch(console.error);
		if(e==data.length-1){
			res.send({done: true})
		}
	})
})

class tings {
	constructor(){
		this.arr = [];
		this.ids = [];
	}
	add(index,value){
		this.ids.push(index);
		this.arr.push({index,value});
	}
	getIndexes(){
		return this.ids;
	}
	getObject() {
		return this.arr;
	}
}

async function savor(found,amtarr){
				for(let i=0;i<found.length;i++){
					let npaid = new paidfee({
						studentID: found[i]._id,
						year: found[i].year,
						amount: amtarr[i].value,
						date: new Date()
					})
					await npaid.save();
				}
}

app.post('/xls', upload.single('xls'), (req,res)=>{
		let obj = nodeXLS.parse(fs.readFileSync(req.file.path));
		let arr = new tings();
		obj.forEach(i=>{
			i.data.forEach(j=>{
				arr.add(...j);
			})
		})
		fee.validateIds(arr.getIndexes()).then(data=>{
			// console.log(data)
			let amtarr = arr.getObject();
			if(data.valid){
				savor(data.found, amtarr);
				res.render('staff/fees', {data: false, success: true})
			}else{
				res.render('staff/fees', {data})
			}
		})
		// console.log(resp)
		//console.log(obj[0].data)
})

class objecto {
	constructor(len){
		this.arr;
		this.len = len;
		this.arr = [];
		for(let i=0;i<len;i++){
			this.arr.push([]);
		}
		console.log(this.arr)
	}
	add(i,j,val){
		this.arr[i][j] = val;
	}
	getArr(){
		return this.arr;
	}
}

function fileParser(arr,progs,func){
	let resarr = [];
	// console.log(arr[0].data)
	arr.forEach(i=>{
		i.data.forEach((j,e)=>{
			if(e>0)resarr.push(func(j,progs))
		})
	})
	return resarr;
}

function lecturerparser(arr,deps){
	return {
		firstname: arr[0],
		surname: arr[1],
		lecturerID: arr[2],
		email: arr[3],
		mobile: arr[4],
		password: (rs.generate(7)).toLowerCase(),
	}
}

function studentparser(arr,progs){
	return {
		firstname: arr[0],
		surname: arr[1],
		studentID: arr[2],
		email: arr[3],
		mobile: arr[4],
		program: progs[arr[5]],
		password: (rs.generate(7)).toLowerCase(),
		year: arr[6]
	}
}

app.post('/studentxls', upload.single('xls'), (req,res)=>{
	let obj = nodeXLS.parse(fs.readFileSync(req.file.path));
	program.find({}).then(resp=>{
		let all = {};
		resp.forEach(i=>{
			all[i.code] = i._id;
		})
		
		let studentArr = fileParser(obj,all,studentparser);
		let sid = new Set();
		let multipeIDS = false;
		studentArr.forEach(i=>{
			if(sid.has(i.studentID)) multipeIDS = true;
			sid.add(i.studentID);
		})
		if(!multipeIDS){
			student.insertMany(studentArr,(err,ress)=>{
				if(err) throw err;
				res.send("Upload was successfull!")
			})
		}else{
			res.send("Some studentID's appeared multiple times;")
		}
		
	})
})

app.post('/lecturerxls', upload.single('xls'), (req,res)=>{
	let obj = nodeXLS.parse(fs.readFileSync(req.file.path));
	let lecturerArr = fileParser(obj,[],lecturerparser);
	let sid = new Set();
		let multipeIDS = false;
		lecturerArr.forEach(i=>{
			if(sid.has(i.lecturerID)) multipeIDS = true;
			sid.add(i.lecturerID);
		})
		if(!multipeIDS){
			lecturer.insertMany(lecturerArr,(err,ress)=>{
				if(err) throw err;
				res.send("Upload was successfull!")
			})
		}else{
			res.send("Some lecturerID's appeared multiple times;")
		}
})

app.post('/config', (req,res)=>{
	let {name, value} = req.body;
	config.updateOne({metaname: name}, {$set: {metaval: value}},{upsert: true}).then(d=>{
		res.json(d);
	})
})

app.get('/logout', (req,res)=>{
	req.session.destroy();
	res.redirect('/login');
})

module.exports = app;