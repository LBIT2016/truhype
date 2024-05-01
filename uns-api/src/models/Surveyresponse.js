import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	author: String,	// sessionId
	ans1: String,
	ans2: String,
	ans3: String,
	posted: { type: Date, default: Date.now }
});

schema.plugin(mongoosePaginate);

export default mongoose.model("Surveyresponse", schema);