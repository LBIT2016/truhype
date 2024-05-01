"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var x = _shortid2.default.generate();
	x = _jsonwebtoken2.default.sign(x, process.env.JWT_SECRET);
	x = x.substr(x.length - 7);
	return x;
};

var _shortid = require("shortid");

var _shortid2 = _interopRequireDefault(_shortid);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }