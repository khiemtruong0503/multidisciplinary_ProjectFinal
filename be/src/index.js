const express = require('express');
const http = require('http');
const morgan = require('morgan');
const db = require('../config/mongoDB');
const app = express();
const port = 5000;
const cors = require('cors')
const server = http.createServer(app);
const route = require('./routes');
const Leds = require('./app/models/Leds');

///////////////////////////////////////////////
////////////// Bug-fixes by Quan //////////////
///////////////////////////////////////////////
const bodyParser = require('body-parser');

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

db.connect();

// app.use(morgan('combined'))
app.use(cors({ origin: 'http://localhost:3000' }));

route(app); // Pass the express app instance to the route function

app.get('/getLedValue', (req, res) => { 
    Leds.findOne({ name: "BBC_LED" })
    .then(led => res.json(led))
    .catch(err => res.json(err));
});


server.listen(port, () => { 
    console.log(`Example app listening on port ${port}`);
});
