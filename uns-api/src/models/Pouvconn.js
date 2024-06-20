import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	postId: { type: String, required: true },		// Post for which upvote has given
	sessionId: { type: String, required: true }		// user's sessionId who has given upvote
});

export default mongoose.model("pouvconn", schema);	// post - upvotes connector