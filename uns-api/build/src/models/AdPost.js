"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoosePaginateV = require("mongoose-paginate-v2");

var _mongoosePaginateV2 = _interopRequireDefault(_mongoosePaginateV);

var _mongooseAggregatePaginate = require("mongoose-aggregate-paginate");

var _mongooseAggregatePaginate2 = _interopRequireDefault(_mongooseAggregatePaginate);

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
	dateCreated: { type: Date },
	type: String,
	title: String,
	text: String,
	images: [String],
	videos: [String],
	category: String,
	isCardStyle: Boolean,
	cardColor: String,
	hashtags: [String],
	upvotes: [{ type: String, default: [] }],
	upvotes_count: { type: Number, default: 0 },
	downvotes: [{ type: String, default: [] }],
	downvotes_count: { type: Number, default: 0 },
	comments: [{
		type: _mongoose2.default.Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	comments_count: { type: Number, default: 0 },
	reports: [{ author: String, category: String, text: String }],
	reports_count: { type: Number, default: 0 },
	isNotification: Boolean,
	locationtype: String,
	locations: [{
		location_country: String,
		location_state: String,
		location_city: String
	}]
});

schema.index({
	title: 'text',
	text: 'text',
	hashtags: 'text'
}, { name: 'search' });

schema.plugin(_mongoosePaginateV2.default);
schema.plugin(_mongooseAggregatePaginate2.default);

exports.default = _mongoose2.default.model("AdPost", schema);