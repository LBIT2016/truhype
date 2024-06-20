"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Comment = require("../models/Comment");

var _Comment2 = _interopRequireDefault(_Comment);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Get upvotes and downvotes of comment
router.post("/getCommentVotes", _authenticate2.default, function (req, res) {
	var commId = req.body.commId;


	_Comment2.default.findOne({ _id: commId }).then(function (comment) {
		res.json({
			success: true,
			upvotes_count: comment.upvotes_count,
			downvotes_count: comment.downvotes_count
		});
	}).catch(function (err) {
		res.status(400).json({ errors: { global: err } });
	});
});

// hasupvoted
router.post("/hasupvoted", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var commId = req.body.commId;


	_Comment2.default.findOne({ _id: commId }, {
		upvotes_count: 1,
		upvotes: {
			"$elemMatch": { "$eq": sessionId }
		}
	}).then(function (comment) {
		if (comment.upvotes.length > 0) {
			res.json({ upvoted: true });
		} else {
			res.json({ upvoted: false });
		}
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

router.post("/hasdownvoted", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var commId = req.body.commId;


	_Comment2.default.findOne({ _id: commId }, {
		upvotes_count: 1,
		downvotes: {
			"$elemMatch": { "$eq": sessionId }
		}
	}).then(function (comment) {
		if (comment.downvotes.length > 0) {
			res.json({ downvoted: true });
		} else {
			res.json({ downvoted: false });
		}
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// //////////////////////// Upvoting

// Upvoting a post
router.post("/upvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var commId = req.body.commId;


	_Comment2.default.updateOne({ _id: commId, upvotes: { "$ne": sessionId } }, // Search for the requested post not has user id (i.e, user has not upvoted earlier)
	{ "$inc": { upvotes_count: 1 }, "$push": { "upvotes": sessionId } // If not has, increment upvote and push the user id into upvotes array.
	}).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Removing Upvote for a comment
router.post("/removeupvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var commId = req.body.commId;


	_Comment2.default.updateOne({ _id: commId, upvotes: sessionId }, // Search for the requested comment has user id (i.e, user has upvoted earlier)
	{ "$inc": { upvotes_count: -1 }, "$pull": { "upvotes": sessionId } // If not has, increment upvote and push the user id into upvotes array.
	}).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// //////////////////////////// downvoting

// Downvoting a comment
router.post("/downvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var commId = req.body.commId;


	_Comment2.default.updateOne({ _id: commId, downvotes: { "$ne": sessionId } }, // Search for the requested comment not has user id (i.e, user has not upvoted earlier)
	{ "$inc": { downvotes_count: 1 }, "$push": { "downvotes": sessionId } // If not has, increment upvote and push the user id into downvotes array.
	}).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Removing Upvote for a comment
router.post("/removedownvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var commId = req.body.commId;


	_Comment2.default.updateOne({ _id: commId, downvotes: sessionId }, // Search for the requested comment has user id (i.e, user has upvoted earlier)
	{ "$inc": { downvotes_count: -1 }, "$pull": { "downvotes": sessionId } // If not has, increment upvote and push the user id into downvotes array.
	}).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

exports.default = router;