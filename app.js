/****************************************************************************** 
 *
 * ITE5315 – Assignment 2 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. 
 * Name: Yash Patel  Student ID: n01675459  Date: [24-06-25] 
 *
 ******************************************************************************/

const express = require('express'); // Load express module  
const path = require('path'); // Load path module for file paths  
const exphbs = require('express-handlebars'); // Load Handlebars engine  
const fs = require('fs'); // File system module
const app = express(); // Create express app  
const port = process.env.port || 3000; // Set server port  

// Load movie data from JSON file
const movieData = JSON.parse(fs.readFileSync('./data/movie-dataset-a2.json'));


// Middleware and view engine setup
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files  
app.set('views', path.join(__dirname, 'views')); // Set views folder path  
//app.engine('.hbs', exphbs.engine({ extname: '.hbs' })); // Configure Handlebars  
app.set('view engine', 'hbs'); // Set Handlebars as the view engine 

// Handlebars with a custom helper named "hasMetaScore" & "highlightIfNoMeta"
const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    hasMetaScore: function (score, options) {
      return score && score.trim() !== '' ? options.fn(this) : '';
    },
    highlightIfNoMeta: function (score) {
      return (!score || score.trim() === '' || score === 'N/A') ? 'highlight' : '';
    }
  },
   partialsDir: path.join(__dirname, 'views', 'partials') 
});


app.engine('.hbs', hbs.engine);
app.engine('.hbs', hbs.engine);
// app.set('view engine', 'pug');


// Home route
app.get('/', (req, res) => {
  res.render('index', { title: 'Express' }); // Render index page
});

// Dummy route
app.get('/users', (req, res) => {
  res.send('respond with a resource');
});

// Show all movies
app.get('/data', (req, res) => {
  res.render('data', { title: 'All Movies', movies: movieData });
});

// Show movie by index
app.get('/data/movie/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < movieData.length) {
    res.render('movie', { title: 'Movie Details', movie: movieData[index] });
  } else {
    res.render('error', { title: 'Error', message: 'Invalid movie index' });
  }
});

// Search movie by ID
app.get('/data/search/id', (req, res) => {
  const id = req.query.id;
  if (id) {
    const result = movieData.find(m => m.Movie_ID == id);
    if (result) {
      res.render('searchById', { title: 'Search Result', movie: result, found: true });
    } else {
      res.render('searchById', { title: 'Search Result', notFound: true });
    }
  } else {
    res.render('searchById', { title: 'Search by ID' });
  }
});

// Search movie by title
app.get('/data/search/title', (req, res) => {
  const title = req.query.title;
  if (title) {
    const results = movieData.filter(m => m.Title.toLowerCase().includes(title.toLowerCase()));
    res.render('searchByTitle', { title: 'Search Results', results, searched: true });
  } else {
    res.render('searchByTitle', { title: 'Search by Title' });
  }
});

//rout to show all data
app.get('/allData', (req, res) => {
  res.render('allData', { title: 'All Movie Info', movies: movieData });
});

// Route to render only movies with Metascore
app.get('/allDataFiltered', (req, res) => {
  res.render('allDataFiltered', { title: 'Movies with Metascore', movies: movieData });
});

//Route show all movies, highlight rows with missing metascore
app.get('/allDataHighlight', (req, res) => {
  res.render('allDataHighlight', { title: 'Highlight Movies Missing Metascore', movies: movieData });
});

//handle unknown routes
app.get('*', (req, res) => {
  res.render('error', { title: 'Error', message: 'Wrong Route' });
});

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
