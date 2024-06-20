const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

mongoose.set("useCreateIndex", true);
mongoose.connect(
	process.env.MONGODB_URL,
	{	
		useNewUrlParser: true,
		server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  		replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
	}	
);
mongoose.connection.on('connected', () => console.log('Connected to database'));  // eslint-disable-line
mongoose.connection.on('error', (err) => console.log('Connection failed with - ', err)); //eslint-disable-line	

module.exports = mongoose;