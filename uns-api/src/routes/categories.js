import express from "express";
import Category from "../models/Category";

const router = express.Router();

router.post("/", (req, res) => {
	Category.distinct("category").then(categories => {
		res.json({ categories });
	});
});

router.post("/insert", (req, res) => {
	const { category } = req.body;

	const newcategory = new Category({ category });
	newcategory.save().then(c => {
		res.json({ category: c.category });
	}).catch(err => {
		res.status(400).json({ errors: { global: err } });
	});
});

router.post("/update", (req, res) => {
	const { oldC, newC } = req.body;

	Category.findOneAndUpdate(
		{ category: oldC },
		{ category: newC }
	).then(() => {
		res.json({ success: true });
	}).catch(err => {
		res.status(400).json({ errors: { global: err } });
	});
});

router.post("/delete", (req, res) => {
	const { category } = req.body;

	Category.findOne({ category }).deleteOne(() => {
		res.json({ success: true });
	}).catch(err => {
		res.status(400).json({ errors: { global: err } });
	})
});

export default router;