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
	posted: { type: Date, default: Date.now },
	postId: { type: _mongoose2.default.Schema.Types.ObjectId },
	upvotes_count: { type: Number, default: 0 },
	downvotes_count: { type: Number, default: 0 },
	upvotes: [{ type: String, default: [] }],
	downvotes: [{ type: String, default: [] }],
	text: String
});

schema.plugin(_mongoosePaginateV2.default);

exports.default = _mongoose2.default.model("Comment", schema);