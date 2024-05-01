import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	postId: { type: String, required: true },		// Post for which downvote has given
	sessionId: { type: String, required: true }		// user's sessionId who has given downvote
});

export default mongoose.model("podvconn", schema);	// post - downvotes connector