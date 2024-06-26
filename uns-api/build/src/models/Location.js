"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
	City: {
		type: String,
		index: true
	},
	State: {
		type: String,
		index: true
	},
	Country: {
		type: String,
		index: true
	}
});

exports.default = _mongoose2.default.model("Location", schema);