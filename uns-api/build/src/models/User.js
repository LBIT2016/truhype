"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
	sessionId: {
		type: String,
		required: true,
		index: true,
		unique: true
	},
	username: { type: String },
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
	return _jsonwebtoken2.default.sign({ sessionId: this.sessionId }, process.env.JWT_SECRET);
};

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		sessionId: this.sessionId,
		token: this.generateJWT()
	};
};

schema.methods.getDetails = function getDetails() {
	return {
		sessionId: this.sessionId,
		dateCreated: this.dateCreated,
		location_city: this.location_city,
		location_state: this.location_state,
		location_country: this.location_country
	};
};

schema.methods.getEncrypKey = function getEncrypKey() {
	return _jsonwebtoken2.default.sign({ key: this.key }, process.env.JWT_SECRET);
};

exports.default = _mongoose2.default.model("User", schema);