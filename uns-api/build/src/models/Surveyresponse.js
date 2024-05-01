"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoosePaginateV = require("mongoose-paginate-v2");

var _mongoosePaginateV2 = _interopRequireDefault(_mongoosePaginateV);

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
	author: String, // sessionId
	ans1: String,
	ans2: String,
	ans3: String,
	posted: { type: Date, default: Date.now }
});

schema.plugin(_mongoosePaginateV2.default);

exports.default = _mongoose2.default.model("Surveyresponse", schema);