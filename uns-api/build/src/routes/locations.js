"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Location = require("../models/Location");

var _Location2 = _interopRequireDefault(_Location);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/countries", function (req, res) {
	_Location2.default.distinct("Country").then(function (countries) {
		res.json({ countries: countries });
	});
});

router.post("/states/:c", function (req, res) {
	_Location2.default.distinct("State", { "Country": req.params.c }).then(function (states) {
		res.json({ states: states });
	});
});

router.post("/cities/:c/:s", function (req, res) {
	_Location2.default.distinct("City", { "Country": req.params.c, "State": req.params.s }).then(function (cities) {
		res.json({ cities: cities });
	});
});

exports.default = router;