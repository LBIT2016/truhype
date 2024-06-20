import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	dateCreated: { type: Date, default: Date.now },
	author: String,
	PostId: mongoose.Schema.Types.ObjectId,
	reason: String
});

export default mongoose.model("Report", schema);