'use strict';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/rideRoutes');
const Messages = require('./common/messages');
//mongoose.Promise = global.Promise;

//the ride db will be created if it does not currently exist
const db = mongoose.connect('mongodb://localhost/rideAPI');
let app = express();
const port = process.env.port || 3000;
let rideRouter = routes();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/rides', rideRouter);

app.get('/', (req, res) => {
  res.send(Messages.API_WELCOME);
});

app.listen(port, function() {
  console.log(`Running on PORT: ${port}`);
});
