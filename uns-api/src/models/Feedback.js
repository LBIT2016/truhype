import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	author: String,	// sessionId
	feedbacktype: String,
	text: String,
	posted: { type: Date, default: Date.now }
});

schema.plugin(mongoosePaginate);

export default mongoose.model("Feedback", schema);