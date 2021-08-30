const express = require('express');
const dotenv=require('dotenv');
const request = require('request');
dotenv.config();
const app = new express();

app.use('/public', express.static('public'));
app.set("view engine", "ejs");

app.get('/', (req, res)=>{
    res.render("homepage");
});

// Search all movies with given name
app.get('/results', (req, res)=>{
    const title = req.query.title;
    const url= `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${title}`;
    
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            // Ivalid movie name
            if (data.Response === 'False') {
                res.send(`Error : ${data.Error}`);
            } else {
                res.render("all_movie", {movie_list: data});
            }
        } else {
            res.send('Bad Request');
        }
    });
});

// Search a particular movie by id
app.get('/results/:id', (req, res)=> {
    const url = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${req.params.id}`;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            // Ivalid movie name
            if (data.Response === 'False') {
                res.send(`Error : ${data.Error}`);
            } else {
                res.render("single_movie", {movie: data});
            }
        } else {
            res.send('Bad Request');
        }
    });
});

// About page
app.get('/about', (req, res)=>{
    res.render("about")
});

// Contact Page
app.get('/contact', (req, res)=>{
    res.render('contact');
});

// Any other request
app.get("*", (req, res)=>{
    res.send("Go back! Illegal response");
});

// Start server
console.log(process.env.PORT)
app.listen(process.env.PORT, ()=>{
    console.log('Server started at port number :' , process.env.PORT);
});