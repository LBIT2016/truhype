"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
	dateCreated: { type: Date, default: Date.now },
	author: String,
	PostId: _mongoose2.default.Schema.Types.ObjectId,
	reason: String
});

exports.default = _mongoose2.default.model("Report", schema);