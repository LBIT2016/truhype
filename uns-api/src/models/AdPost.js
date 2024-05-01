import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
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
	upvotes_count: { type: Number, default: 0},
	downvotes: [{ type: String, default: [] }],
	downvotes_count: { type: Number, default: 0},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	comments_count: { type: Number, default: 0},
	reports: [{ author: String, category: String, text: String }],
	reports_count: { type: Number, default: 0},
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

schema.plugin(mongoosePaginate);
schema.plugin(mongooseAggregatePaginate);

export default mongoose.model("AdPost", schema);