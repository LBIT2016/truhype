"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Feedback = require("../models/Feedback");

var _Feedback2 = _interopRequireDefault(_Feedback);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
// router.use(authenticate);

router.post("/insert", _authenticate2.default, function (req, res) {
	var feedback = req.body.feedback;

	feedback.author = req.currentUser.sessionId;

	var nfeed = new _Feedback2.default({
		author: feedback.author,
		feedbacktype: feedback.feedbacktype,
		text: feedback.text
	});
	nfeed.save().then(function () {
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
		select: '-author -posted',
		sort: { posted: -1 },
		lean: true,
		limit: limit,
		page: pageNo
	};

	var errors = [];
	_Feedback2.default.paginate(query, options).then(function (feedbacks) {
		res.json({ feedbacks: feedbacks });
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: { global: err } });
	});
});

exports.default = router;