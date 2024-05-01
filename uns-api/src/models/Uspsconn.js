import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	sessionId: { type: String, required: true },		// user's sessionId
	postId: { type: String, required: true }
});

export default mongoose.model("uspsconn", schema);	// user - posts_seen connector