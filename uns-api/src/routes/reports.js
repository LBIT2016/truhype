import express from "express";
import Report from "../models/Report";

const router = express.Router();

router.post("/find", (req, res) => {
	const { postId } = req.body;
	Report.findOne({ postId })
		.then(report => {
			res.json({ report });
		}).catch(err => res.status(400).json({ errors: {global: err} }));
});

export default router;