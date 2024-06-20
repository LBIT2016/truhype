import jwt from "jsonwebtoken";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true,
		index: true,
		unique: true
	},
	username: {type: String},
	key: String,
	dateCreated: { type: Date, default: Date.now },
	location_country: { type: String, default: "" },
	location_state: { type: String, default: "" },
	location_city: { type: String, default: "" },
	upvotes_given: { type: Number, default: 0 },
	downvotes_given: { type: Number, default: 0 },
	posts_seen: { type: Number, default: 0 }
});

schema.methods.generateJWT = function generateJWT() {
	return jwt.sign({ sessionId: this.sessionId }, process.env.JWT_SECRET);
}

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		sessionId: this.sessionId,
		token: this.generateJWT()
	}
}

schema.methods.getDetails = function getDetails() {
	return {
		sessionId: this.sessionId,
		dateCreated: this.dateCreated,
		location_city: this.location_city,
		location_state: this.location_state,
		location_country: this.location_country
	}	
}

schema.methods.getEncrypKey = function getEncrypKey() {
	return jwt.sign({ key: this.key }, process.env.JWT_SECRET);
}

export default mongoose.model("User", schema);