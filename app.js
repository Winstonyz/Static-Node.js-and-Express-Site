const express = require('express');
const app = express();
const {projects} = require('./data.json');

app.use(express.json());

//set up middleware
//set “view engine” to “pug”
app.set('view engine', 'pug');

//use a static route and the express.static method to serve the static files located in the public folder
app.use('/static', express.static('public'));


//set up the routes
//An "index" route (/) to render the "Home" page with the locals set to data.projects
app.get('/', (req, res, next) => {
  res.render('index', {projects});
});

//An "about" route (/about) to render the "About" page
app.get('/about', (req, res, next) => {
  res.render('about');
});

//Dynamic "project" routes (/project/:id or /projects/:id) based on the id of the project that render a customized 
//version of the Pug project template to show off each project. Which means adding data, or "locals", as an object 
//that contains data to be passed to the Pug template.
app.get('/projects/:id', (req, res, next) => {
  const pid=req.params.id;
  const project = projects[pid];
  if (project){
    res.render('project', {project})
  }else{
    next();
  }  
});


//If a user navigates to a non-existent or undefined route, such as /noroute or /project/noroute, 
//or if a request for a resource fails for whatever reason, the app will handle the problem in a user friendly way.
//404 error
app.use((req, res, next) => {
  const err = new Error ('This page does not exist');
  console.log(err.message);
  err.status = 404;
  next(err);
});

//After the 404 handler in app.js add a global error handler that will deal with any server errors the app 
//encounters. This handler should ensure that there is an err.status property and an err.message property 
//if they don't already exist, and then log out the err object's message and status.
app.use((err, req, res, next) =>{
  if(err.status===404){
    err.message = 'Sorry, content not found';
    console.log(err.message);
    res.locals.err = err;
    res.status(err.status);
    res.render('error');
  } else {
    err.message = 'server error';
    res.status = err.status;
    res.reder('error');
  }

  console.log(err.status, err,message);
})

//start your server. Your app should listen on port 3000, and log a string to the console that says which port the app is listening to.
app.listen(3000, function (){
  //log a string to the console that says which port the app is listening to
  console.log('The application is listening to port 3000')
 })