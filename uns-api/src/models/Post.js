import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	dateCreated: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },	// 30 days of expiry
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
	upvotes_count: { type: Number, default: 0},
	downvotes_count: { type: Number, default: 0},
	comments_count: { type: Number, default: 0},
	reports: [{ id: String, category: String }],
	reports_count: { type: Number, default: 0}
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

schema.plugin(mongoosePaginate);

export default mongoose.model("Post", schema);