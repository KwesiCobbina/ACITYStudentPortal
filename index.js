 const express = require('express');
require('dotenv').config();
const app = express();
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cloudinary = require('cloudinary');
const MongoStore = require('connect-mongo')(session);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.use(require('morgan')('dev'));
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USERNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

let dbURI = process.env.DB_URI;
if(process.env.Dev == "true"){
  dbURI = `mongodb://127.0.0.1:27017/test`
}

console.log(dbURI)

mongoose.connect(dbURI,{
	useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error',function(err){
	console.log(err);
})
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: db })
}));

//controllers over here
const {studentLoggedIn,lecturerLoggedIn,staffLoggedIn} = require('./config/authorize');

app.use('/auth', require("./controllers/auth"));
app.use('/student', studentLoggedIn, require("./controllers/student"));
app.use('/staff', staffLoggedIn, require("./controllers/staff"));
app.use('/lecturer', lecturerLoggedIn, require("./controllers/lecturer"));
app.use('/', require("./controllers/main"));


app.listen(process.env.PORT, (err)=>{
  if(err) throw err;
  console.log(`server at port ${process.env.PORT}`);
})
