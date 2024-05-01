import express from "express";
import Surveyresponse from "../models/Surveyresponse";

import authenticate from "../middlewares/authenticate";

const router = express.Router();
// router.use(authenticate);

router.post("/insert", authenticate, (req, res) => {
	const { survey } = req.body;
	survey.author = req.currentUser.sessionId;

	const nSurvey = new Surveyresponse({
		author: survey.author,
		ans1: survey.ans1,
		ans2: survey.ans2,
		ans3: survey.ans3
	});
	nSurvey.save()
		.then(() => res.json({ success: true }))
		.catch(err => res.status(400).json({ errors: { global: err } }));
});

router.post("/fetch/:per/:page", (req, res) => {
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	const query = {};
	const options = {
		select: '-author',
		sort: { posted: -1 },
		lean: true,
		limit,
		page: pageNo
	}

	const errors = [];
	Surveyresponse.paginate(query, options)
		.then(surveys => {
			res.json({ surveys });
		}).catch(err => {
			errors.push(err.message);
			res.status(400).json({ errors: { global: err } })
		});
});

router.post("/getansone", (req, res) => {
	const errors = [];
	Surveyresponse.find({})
		.then(docs => {
			const totalrs = docs.length;
			Surveyresponse.find({ ans1: "yes" })
				.then(d => {
					let yes = d.length;
					yes = Math.round((yes / totalrs)*100);
					const no = 100 - yes;
					res.json({ ans: { yes, no, totalrs } });
				}).catch(err => {
					errors.push(err);
				})
		}).catch(err => {
			errors.push(err);
			res.status(400).json({ err })
		});

});

router.post("/getanstwo", (req, res) => {
	const errors = [];
	Surveyresponse.find({})
		.then(docs => {
			const totalrs = docs.length;

			Surveyresponse.find({ ans2: "less than 30 days" })
				.then(d => {
					let l30 = d.length;

					l30 = Math.round((l30 / totalrs)*100);
					Surveyresponse.find({ ans2: "30 days only" })
						.then(e => {
							let eq30 = e.length;

							eq30 = Math.round((eq30 / totalrs)*100);
							const m30 = 100 - l30 - eq30;
							res.json({ ans: { l30, eq30, m30, totalrs } });
						})
				}).catch(err => {
					errors.push(err.message);
				})
		}).catch(err => {
			errors.push(err.message);
			res.status(400).json({ err });
		});

});

export default router;

