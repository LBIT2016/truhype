import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	category: String
});

export default mongoose.model("Category", schema);