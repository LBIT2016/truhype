import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	user: String,
	dateCreated: { type: Date, default: Date.now },
	action: String,
	postId: String
});

schema.plugin(mongoosePaginate);

export default mongoose.model("Activity", schema);