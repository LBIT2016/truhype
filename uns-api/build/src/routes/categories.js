"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Category = require("../models/Category");

var _Category2 = _interopRequireDefault(_Category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/", function (req, res) {
	_Category2.default.distinct("category").then(function (categories) {
		res.json({ categories: categories });
	});
});

router.post("/insert", function (req, res) {
	var category = req.body.category;


	var newcategory = new _Category2.default({ category: category });
	newcategory.save().then(function (c) {
		res.json({ category: c.category });
	}).catch(function (err) {
		res.status(400).json({ errors: { global: err } });
	});
});

router.post("/update", function (req, res) {
	var _req$body = req.body,
	    oldC = _req$body.oldC,
	    newC = _req$body.newC;


	_Category2.default.findOneAndUpdate({ category: oldC }, { category: newC }).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		res.status(400).json({ errors: { global: err } });
	});
});

router.post("/delete", function (req, res) {
	var category = req.body.category;


	_Category2.default.findOne({ category: category }).deleteOne(function () {
		res.json({ success: true });
	}).catch(function (err) {
		res.status(400).json({ errors: { global: err } });
	});
});

exports.default = router;