import express from "express";

import User from "../models/User";
import Location from "../models/Location"; 

const router = express.Router();

router.get("/", (req, res) => {
	res.send("I am working");
});

router.post("/fetchTotalNoAccounts", (req, res) => {
	User.find().count((err, count) => {
		res.json({ total_acc: count });
	});
});

router.post("/fetchNoAccounts", (req, res) => {
	const { country, state, city } = req.body;
	User.find({ 
		location_country: country, 
		location_state: state, 
		location_city: city 
	}).count((err, count) => {
		res.json({ accounts: count });
	});
});

router.post("/fetchStatsByCountry", (req, res) => {
	const { country } = req.body;
	Location.distinct("State", { Country: country })
		.exec()
		.then(docs => {	// eslint-disable-line
				return Promise.all(docs.map(doc => { // elsint-disable-line		
					return User.find({ location_country: country, location_state: doc })
						.exec()
						.then(results => {	// eslint-disable-line
							return { label: doc, value: results.length }; 
						});
				}));
		})
		.then(countryStats => {
			res.json({ countryStats });
		});
});

router.post("/fetchStatsByState", (req, res) => {
	const { country, state } = req.body;
	Location.distinct("City", { Country: country, State: state })
		.exec()
		.then(docs => {	// eslint-disable-line
				return Promise.all(docs.map(doc => { // elsint-disable-line		
					return User.find({ location_country: country, location_state: state, location_city: doc })
						.exec()
						.then(results => {	// eslint-disable-line
							return { label: doc, value: results.length }; 
						});
				}));
		})
		.then(stateStats => {
			res.json({ stateStats });
		});
});

export default router;