"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Hashtag = require("../models/Hashtag");

var _Hashtag2 = _interopRequireDefault(_Hashtag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import authenticate from "../middlewares/authenticate";

var router = _express2.default.Router();
// router.use(authenticate);

/* router.get("/", (req, res) => {
	res.send("I am working");
}); */

// Find a hashtag if found, increment its count else insert it as a new doc.
router.post("/insert", function (req, res) {
	var hashtag = req.body.hashtag;


	_Hashtag2.default.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Fetch top ten most used hashtags
router.post("/topeight", function (req, res) {
	_Hashtag2.default.find({}).sort({ count: -1 }).limit(8).then(function (hashtags) {
		res.json({ hashtags: hashtags });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Find hashtags by query from search
router.post("/", function (req, res) {
	var keyword = req.body.keyword;

	_Hashtag2.default.find({ hashtag: { "$regex": keyword, "$options": "i" } }).limit(5).then(function (hashtags) {
		res.json({ hashtags: hashtags });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

exports.default = router;