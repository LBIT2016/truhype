"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Surveyresponse = require("../models/Surveyresponse");

var _Surveyresponse2 = _interopRequireDefault(_Surveyresponse);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
// router.use(authenticate);

router.post("/insert", _authenticate2.default, function (req, res) {
	var survey = req.body.survey;

	survey.author = req.currentUser.sessionId;

	var nSurvey = new _Surveyresponse2.default({
		author: survey.author,
		ans1: survey.ans1,
		ans2: survey.ans2,
		ans3: survey.ans3
	});
	nSurvey.save().then(function () {
		return res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

router.post("/fetch/:per/:page", function (req, res) {
	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;
	var query = {};
	var options = {
		select: '-author',
		sort: { posted: -1 },
		lean: true,
		limit: limit,
		page: pageNo
	};

	var errors = [];
	_Surveyresponse2.default.paginate(query, options).then(function (surveys) {
		res.json({ surveys: surveys });
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: { global: err } });
	});
});

router.post("/getansone", function (req, res) {
	var errors = [];
	_Surveyresponse2.default.find({}).then(function (docs) {
		var totalrs = docs.length;
		_Surveyresponse2.default.find({ ans1: "yes" }).then(function (d) {
			var yes = d.length;
			yes = Math.round(yes / totalrs * 100);
			var no = 100 - yes;
			res.json({ ans: { yes: yes, no: no, totalrs: totalrs } });
		}).catch(function (err) {
			errors.push(err);
		});
	}).catch(function (err) {
		errors.push(err);
		res.status(400).json({ err: err });
	});
});

router.post("/getanstwo", function (req, res) {
	var errors = [];
	_Surveyresponse2.default.find({}).then(function (docs) {
		var totalrs = docs.length;

		_Surveyresponse2.default.find({ ans2: "less than 30 days" }).then(function (d) {
			var l30 = d.length;

			l30 = Math.round(l30 / totalrs * 100);
			_Surveyresponse2.default.find({ ans2: "30 days only" }).then(function (e) {
				var eq30 = e.length;

				eq30 = Math.round(eq30 / totalrs * 100);
				var m30 = 100 - l30 - eq30;
				res.json({ ans: { l30: l30, eq30: eq30, m30: m30, totalrs: totalrs } });
			});
		}).catch(function (err) {
			errors.push(err.message);
		});
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ err: err });
	});
});

exports.default = router;