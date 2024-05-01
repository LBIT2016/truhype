import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	hashtag: String,
	count: { type: Number, default: 0 }
});

export default mongoose.model("Hashtag", schema);