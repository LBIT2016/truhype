import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "../mongoose";

const schema = new mongoose.Schema({
	name: { type: String, default: "Admin" },
	sessions_count: { type: Number, default: 0},
	username: {
		type: String,
		required: true,
		lowercase: true,
		index: true,
		unique: true
	},
	passwordHash: { type: String, required: true },
	masterKeyHash: { type: String, required: true },
	posts: [String]
});

schema.methods.generateJWT = function generateJWT() {
	return jwt.sign(
		{
			_id: this._id	// eslint-disable-line
		},
		process.env.JWT_SECRET
	);
};

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		username: this.username,
		token: this.generateJWT()
	};
};

schema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.isValidMasterKey = function isValidMasterKey(masterkey) {
	return bcrypt.compareSync(masterkey, this.masterKeyHash);
};

schema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10);
};

export default mongoose.model("Admin", schema);