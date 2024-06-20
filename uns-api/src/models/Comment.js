import mongoosePaginate from "mongoose-paginate-v2";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	posted: { type: Date, default: Date.now },
	postId: {type: mongoose.Schema.Types.ObjectId},
	upvotes_count: { type: Number, default: 0},
	downvotes_count: { type: Number, default: 0},
	upvotes: [{ type: String, default: [] }],
	downvotes: [{ type: String, default: [] }],
	text: String
});

schema.plugin(mongoosePaginate);

export default mongoose.model("Comment", schema);