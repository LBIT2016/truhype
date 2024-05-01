"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Report = require("../models/Report");

var _Report2 = _interopRequireDefault(_Report);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post("/find", function (req, res) {
	var postId = req.body.postId;

	_Report2.default.findOne({ postId: postId }).then(function (report) {
		res.json({ report: report });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

exports.default = router;