"use strict";

var dotenv = require("dotenv");
var mongoose = require("mongoose");

dotenv.config();

mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
});
mongoose.connection.on('connected', function () {
	return console.log('Connected to database');
}); // eslint-disable-line
mongoose.connection.on('error', function (err) {
	return console.log('Connection failed with - ', err);
}); //eslint-disable-line	

module.exports = mongoose;