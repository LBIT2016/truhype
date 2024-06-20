"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
	sessionId: { type: String, required: true }, // user's sessionId
	postId: { type: String, required: true }
});

exports.default = _mongoose2.default.model("uspsconn", schema); // user - posts_seen connector