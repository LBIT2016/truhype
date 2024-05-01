"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
	name: { type: String, default: "Admin" },
	sessions_count: { type: Number, default: 0 },
	username: {
		type: String,
		required: true,
		lowercase: true,
		index: true,
		unique: true
	},
	passwordHash: { type: String, required: true },
	masterKeyHash: { type: String, required: true },
	posts: [String]
});

schema.methods.generateJWT = function generateJWT() {
	return _jsonwebtoken2.default.sign({
		_id: this._id // eslint-disable-line
	}, process.env.JWT_SECRET);
};

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		username: this.username,
		token: this.generateJWT()
	};
};

schema.methods.isValidPassword = function isValidPassword(password) {
	return _bcrypt2.default.compareSync(password, this.passwordHash);
};

schema.methods.isValidMasterKey = function isValidMasterKey(masterkey) {
	return _bcrypt2.default.compareSync(masterkey, this.masterKeyHash);
};

schema.methods.setPassword = function setPassword(password) {
	this.passwordHash = _bcrypt2.default.hashSync(password, 10);
};

exports.default = _mongoose2.default.model("Admin", schema);