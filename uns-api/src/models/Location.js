import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	City: {
		type: String,
		index: true
	},
	State: {
		type: String,
		index: true
	},
	Country: {
		type: String,
		index: true
	}
});

export default mongoose.model("Location", schema);