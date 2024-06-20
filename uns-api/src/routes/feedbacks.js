import express from "express";
import Feedback from "../models/Feedback";

import authenticate from "../middlewares/authenticate";

const router = express.Router();
// router.use(authenticate);

router.post("/insert", authenticate, (req, res) => {
	const { feedback } = req.body;
	feedback.author = req.currentUser.sessionId;

	const nfeed = new Feedback({ 
		author: feedback.author,
		feedbacktype: feedback.feedbacktype,
		text: feedback.text
	});
	nfeed.save()
		.then(() => res.json({ success: true }))
		.catch(err => res.status(400).json({ errors: { global: err } }));
});

router.post("/fetch/:per/:page", (req, res) => {
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	const query = {};
	const options = {
		select: '-author -posted',
		sort: { posted: -1 },
		lean: true,
		limit,
		page: pageNo
	}

	const errors = [];
	Feedback.paginate(query, options)
		.then(feedbacks => {
			res.json({ feedbacks });
		}).catch(err => {
			errors.push(err.message);
			res.status(400).json({ errors: { global: err } })
		});
});

export default router;

