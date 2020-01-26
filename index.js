const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//controllers over here
app.use('/', require("./controllers/main"));


app.listen(process.env.PORT, (err)=>{
  if(err) throw err;
  console.log(`server at port ${process.env.PORT}`);
})
