import express from "express";
import Hashtag from "../models/Hashtag";

// import authenticate from "../middlewares/authenticate";

const router = express.Router();
// router.use(authenticate);

/* router.get("/", (req, res) => {
	res.send("I am working");
}); */

// Find a hashtag if found, increment its count else insert it as a new doc.
router.post("/insert", (req, res) => {
	const { hashtag } = req.body;

	Hashtag.findOneAndUpdate(
		{ hashtag },
		{ $inc: { count: 1 } },
		{ upsert: true, new: true, setDefaultsOnInsert: true }
	).then(() => {
		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// Fetch top ten most used hashtags
router.post("/topeight", (req, res) => {
	Hashtag.find({})
		.sort({ count: -1 })
		.limit(8)
		.then(hashtags => {
			res.json({ hashtags });
		})
		.catch(err => res.status(400).json({ errors: { global: err } }));
});	

// Find hashtags by query from search
router.post("/", (req, res) => {
	const { keyword } = req.body;
	Hashtag.find({ hashtag: { "$regex": keyword, "$options": "i" } })
		.limit(5)
		.then(hashtags => {
			res.json({ hashtags });
		})
		.catch(err => res.status(400).json({ errors: { global: err } }));	
});

export default router;