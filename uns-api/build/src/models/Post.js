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
	dateCreated: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30 days of expiry
	type: String,
	location_country: String,
	location_state: String,
	location_city: String,
	author: String,
	title: String,
	text: String,
	images: [String],
	videos: [String],
	category: String,
	isCardStyle: Boolean,
	cardColor: String,
	hashtags: [String],
	upvotes_count: { type: Number, default: 0 },
	downvotes_count: { type: Number, default: 0 },
	comments_count: { type: Number, default: 0 },
	reports: [{ id: String, category: String }],
	reports_count: { type: Number, default: 0 }
});

/* schema.pre("save", next => {
	this.dateCreated = new Date();
	next();
}); */
schema.index({
	title: 'text',
	text: 'text',
	hashtags: 'text'
}, { name: 'search' });

schema.plugin(_mongoosePaginateV2.default);

exports.default = _mongoose2.default.model("Post", schema);