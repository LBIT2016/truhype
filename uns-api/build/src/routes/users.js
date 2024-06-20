"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// import parseErrors from "../utils/parseErrors";


var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _Admin = require("../models/Admin");

var _Admin2 = _interopRequireDefault(_Admin);

var _Post = require("../models/Post");

var _Post2 = _interopRequireDefault(_Post);

var _Activity = require("../models/Activity");

var _Activity2 = _interopRequireDefault(_Activity);

var _Uspsconn = require("../models/Uspsconn");

var _Uspsconn2 = _interopRequireDefault(_Uspsconn);

var _sessionIdGen = require("../utils/sessionIdGen");

var _sessionIdGen2 = _interopRequireDefault(_sessionIdGen);

var _keyGen = require("../utils/keyGen");

var _keyGen2 = _interopRequireDefault(_keyGen);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get("/", function (req, res) {
	res.send("Hey I am working too.");
});

router.post("/", function (req, res) {
	var sessionId = (0, _sessionIdGen2.default)();
	var key = (0, _keyGen2.default)();
	var user = new _User2.default({ sessionId: sessionId, key: key });
	user.save().then(function (userRecord) {
		_Admin2.default.updateOne({ name: "Admin" }, { $inc: { sessions_count: 1 } }).then(function () {
			res.json({ user: userRecord.toAuthJSON() });
		});
	}).catch(function (err) {
		res.status(400).json({ errors: err });
	});
});

router.post("/checkDetails", function (req, res) {
	var sessionId = req.body.sessionId;

	_User2.default.findOne({ sessionId: sessionId }).then(function (user) {
		if (user.username) {
			res.json({ success: true });
		} else {
			res.json({ success: false });
		}
	}).catch(function (err) {
		res.status(400).json({ err: err });
	});
});

// Login function
router.post("/login", function (req, res) {
	var credentials = req.body.credentials;

	_User2.default.findOne({ username: credentials.username, key: credentials.password }).then(function (user) {
		if (user) {
			res.json({ user: user.toAuthJSON() });
		} else {
			res.status(400).json({ errors: { global: "Invalid credentials" } });
		}
	});
});

// set user's location and username
router.post("/setUserData", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var _req$body$data = req.body.data,
	    country = _req$body$data.country,
	    state = _req$body$data.state,
	    city = _req$body$data.city,
	    username = _req$body$data.username;

	_User2.default.findOneAndUpdate({ sessionId: sessionId }, {
		location_country: country,
		location_state: state,
		location_city: city,
		username: username
	}).then(function (userRecord) {
		return userRecord ? res.json({ user: userRecord.toAuthJSON() }) : res.status(400).json({});
	});
});

// return location
router.post("/getlocation", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	_User2.default.findOne({ sessionId: sessionId }).then(function (userRecord) {
		return userRecord ? res.json({
			user: _extends({}, userRecord.toAuthJSON(), {
				location_city: userRecord.location_city,
				location_state: userRecord.location_state,
				location_country: userRecord.location_country
			})
		}) : res.status(400).json({ err: { global: "User location not found!" } });
	});
});

// return username
router.post("/getusername", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	_User2.default.findOne({ sessionId: sessionId }).then(function (userRecord) {
		return userRecord ? res.json({ username: userRecord.username }) : res.status(400).json({ err: { global: "User location not found!" } });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

// return key
router.post("/getkey", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	_User2.default.findOne({ sessionId: sessionId }).then(function (userRecord) {
		return userRecord ? res.json({ key: userRecord.getEncrypKey() }) : res.status(400).json({ err: { global: "User key not found!" } });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

// Regenrate key
router.post("/regenKey", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	var key = (0, _keyGen2.default)();
	_User2.default.findOneAndUpdate({ sessionId: sessionId }, { key: key }).then(function (userRecord) {
		return userRecord ? res.json({ key: userRecord.getEncrypKey() }) : res.status(400).json({ err: { global: "User key not found!" } });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

// return user's posts
router.post("/getPosts/:per/:page", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;

	var query = {
		author: sessionId
	};

	var options = {
		select: '_id title text images videos type isCardStyle cardColor',
		sort: { dateCreated: -1 },
		lean: true,
		page: pageNo,
		limit: limit
	};

	_Post2.default.paginate(query, options).then(function (posts) {
		res.json({ posts: posts });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

// delete all user's posts
router.post("/deletePosts", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	/* User.findOne({ sessionId })
 	.then(user => {
 		const posts = user.posts;
 		if(posts && posts.length>0) {
 			const errors = [];
 			const action = "delete";
 			const postId = "";
 			const newactivity = new Activity({ action, postId, user: sessionId });
 			newactivity.save()
 				.then(() => {
 					User.findOneAndUpdate(
 						{ sessionId },
 						{ $set: { posts: [] } }	
 					).catch(err => errors.push(err));
 				}).catch(err => {
 					errors.push(err);
 				});
 
 			Post.remove({ _id: { $in: posts } })
 				.then(() => res.json({ success: true }))
 				.catch(err => {
 					errors.push(err);
 					res.status(400).json({ errors });
 				})
 		} else {
 			res.json({ success: true });
 		}
 		
 	}); */

	var errors = [];
	_Uspsconn2.default.find({ sessionId: sessionId }).remove(function () {
		_Post2.default.find({ author: sessionId }).remove(function () {
			return res.json({ success: true });
		}).catch(function (err) {
			errors.push(err);
		});
	}).catch(function (err) {
		errors.push(err);
		res.status(400).json({ errors: errors });
	});
});

// return user's activity
router.post("/getActivity/:per/:page", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;

	var query = {
		user: sessionId
	};

	var options = {
		select: 'action postId',
		sort: { dateCreated: -1 },
		lean: true,
		page: pageNo,
		limit: limit
	};

	_Activity2.default.paginate(query, options).then(function (activity) {
		res.json({ activity: activity });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

// return user's upvotes_given, downvotes_given and comments_given
router.post("/getAnalytics", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;

	_User2.default.findOne({ sessionId: sessionId }).then(function (user) {
		res.json({
			analytics: {
				upvotes_given: user.upvotes_given,
				downvotes_given: user.downvotes_given,
				posts_seen: user.posts_seen
			}
		});
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// update posts Seen
router.post("/updatePostsSeen", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;


	if (postId && postId !== "" && postId !== null) {
		/* User.findOneAndUpdate(
  	{ sessionId, posts_seen_posts: { "$ne": postId } },
  	{ $inc: { posts_seen: 1 }, $push: { posts_seen_posts: postId } }
  ).then(user => {
  	res.json({ 
  		analytics: {
  			upvotes_given: user.upvotes_given,
  			downvotes_given: user.downvotes_given,
  			posts_seen: user.posts_seen
  		}
  	})
  }).catch(err => res.json({ errors: { global: err } })); */
		var errors = [];
		_Uspsconn2.default.findOne({ sessionId: sessionId, postId: postId }).then(function (doc) {
			if (doc) {
				res.json({});
			} else {
				var newdoc = new _Uspsconn2.default({ sessionId: sessionId, postId: postId });
				newdoc.save().then(function () {
					_User2.default.findOneAndUpdate({ sessionId: sessionId }, { $inc: { posts_seen: 1 } }).then(function (user) {
						res.json({
							analytics: {
								upvotes_given: user.upvotes_given,
								downvotes_given: user.downvotes_given,
								posts_seen: user.posts_seen
							}
						});
					}).catch(function (err) {
						return errors.push(err);
					});
				}).catch(function (err) {
					return errors.push(err);
				});
			}
		}).catch(function (err) {
			errors.push(err);
			res.status(400).json({ errors: errors });
		});
	} else {
		res.json({});
	}
});

exports.default = router;