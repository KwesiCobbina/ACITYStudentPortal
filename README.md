# ACITYStudentPortal

Read Fearuturelist.md

## Before you get the project started you'll need a file name .env in the project director
This is the environment variables file and you'll have to values to all the variables.
Below is a template. 
1. Create the .env file
2. Open in a code editor then copy and paste template into it.
3. Fill in the values
4. Remember to remove all comments in the template file
```text
PORT = 3000 // the port your program will be running on
DBUSER = // the database username
DBPASS =    // the database password
Dev = true // true for development and false for production
SESSION_SECRET = // any string you want to use as secret
CLOUDINARY_USERNAME = // cloudinary username
CLOUDINARY_API_KEY =   // cloudinary API key
CLOUDINARY_API_SECRET = // cloudinary secret
```
You can use [MLAB](http://mlab.com/) for the database and here is [CLOUDINARY](https://cloudinary.com/)

## How to get this project started
You need to have Node installed on your PC. You can then validate whether you have it using
```bash
node -v
```
And also NPM using
```bash
npm -v
```

If you have these two on your machine, the next thing to do is to change directory into the project
```bash
cd ../../../AcityStudentPortal
```
then run the command below
```bash
    npm install && npm start
```