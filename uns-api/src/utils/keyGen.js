import shortid from "shortid";
import jwt from "jsonwebtoken";

export default function() {
	let x = shortid.generate();
	x = jwt.sign(x, process.env.JWT_SECRET);
	x = x.substr(x.length - 7);
	return x;
}