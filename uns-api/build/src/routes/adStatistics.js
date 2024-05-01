"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _Location = require("../models/Location");

var _Location2 = _interopRequireDefault(_Location);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get("/", function (req, res) {
	res.send("I am working");
});

router.post("/fetchTotalNoAccounts", function (req, res) {
	_User2.default.find().count(function (err, count) {
		res.json({ total_acc: count });
	});
});

router.post("/fetchNoAccounts", function (req, res) {
	var _req$body = req.body,
	    country = _req$body.country,
	    state = _req$body.state,
	    city = _req$body.city;

	_User2.default.find({
		location_country: country,
		location_state: state,
		location_city: city
	}).count(function (err, count) {
		res.json({ accounts: count });
	});
});

router.post("/fetchStatsByCountry", function (req, res) {
	var country = req.body.country;

	_Location2.default.distinct("State", { Country: country }).exec().then(function (docs) {
		// eslint-disable-line
		return Promise.all(docs.map(function (doc) {
			// elsint-disable-line		
			return _User2.default.find({ location_country: country, location_state: doc }).exec().then(function (results) {
				// eslint-disable-line
				return { label: doc, value: results.length };
			});
		}));
	}).then(function (countryStats) {
		res.json({ countryStats: countryStats });
	});
});

router.post("/fetchStatsByState", function (req, res) {
	var _req$body2 = req.body,
	    country = _req$body2.country,
	    state = _req$body2.state;

	_Location2.default.distinct("City", { Country: country, State: state }).exec().then(function (docs) {
		// eslint-disable-line
		return Promise.all(docs.map(function (doc) {
			// elsint-disable-line		
			return _User2.default.find({ location_country: country, location_state: state, location_city: doc }).exec().then(function (results) {
				// eslint-disable-line
				return { label: doc, value: results.length };
			});
		}));
	}).then(function (stateStats) {
		res.json({ stateStats: stateStats });
	});
});

exports.default = router;