"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Hashtag = require("../models/Hashtag");

var _Hashtag2 = _interopRequireDefault(_Hashtag);

var _AdPost = require("../models/AdPost");

var _AdPost2 = _interopRequireDefault(_AdPost);

var _Admin = require("../models/Admin");

var _Admin2 = _interopRequireDefault(_Admin);

var _Activity = require("../models/Activity");

var _Activity2 = _interopRequireDefault(_Activity);

var _Comment = require("../models/Comment");

var _Comment2 = _interopRequireDefault(_Comment);

var _Report = require("../models/Report");

var _Report2 = _interopRequireDefault(_Report);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.post("/insert", function (req, res) {
	var type = req.body.adpost.type;

	/* eslint-disable */

	if (type === 'text') {
		var _req$body$adpost = req.body.adpost,
		    locations = _req$body$adpost.locations,
		    locationtype = _req$body$adpost.locationtype,
		    isNotification = _req$body$adpost.isNotification,
		    title = _req$body$adpost.title,
		    text = _req$body$adpost.text,
		    category = _req$body$adpost.category,
		    hashtags = _req$body$adpost.hashtags,
		    isCardStyle = _req$body$adpost.isCardStyle,
		    cardColor = _req$body$adpost.cardColor;

		var _errors = [];

		if (hashtags.length > 0) {
			hashtags.map(function (hashtag) {
				_Hashtag2.default.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch(function (err) {
					return _errors.push(err);
				});
				return null;
			});
		}
		var textpost = new _AdPost2.default({
			type: type,
			locationtype: locationtype,
			locations: locations,
			isNotification: isNotification,
			title: title,
			text: text,
			category: category,
			hashtags: hashtags,
			isCardStyle: isCardStyle,
			cardColor: cardColor
		});
		textpost.save().then(function (textpostRecord) {
			var adpost = {};
			adpost._id = textpostRecord._id;
			adpost.category = textpostRecord.category;
			adpost.comments_count = textpostRecord.comments_count;
			adpost.downvotes_count = textpostRecord.downvotes_count;
			adpost.upvotes_count = textpostRecord.upvotes_count;
			adpost.hashtags = textpostRecord.hashtags;
			adpost.text = textpostRecord.text;
			adpost.title = textpostRecord.title;
			adpost.type = textpostRecord.type;
			adpost.isCardStyle = textpostRecord.isCardStyle;
			adpost.cardColor = textpostRecord.cardColor;

			_Admin2.default.findOneAndUpdate({ name: "Admin" }, { $push: { posts: textpostRecord._id } }).catch(function (err) {
				return _errors.push(err);
			});

			/*const action = "create";
   const newactivity = new Activity({ 
   	action, 
   	postId: textpostRecord._id, 
   	user: sessionId 
   });
   newactivity.save()
   	.then(activity => {
   		User.findOneAndUpdate(
   			{ sessionId },
   			{ $push: { activity: activity._id } }	// eslint-disable-line
   		).catch(err => errors.push(err));
   		
   	}).catch(err => {
   		errors.push(err);
   		res.status(400).json({ errors });
   	});*/

			res.json({ post: adpost });
		}).catch(function (err) {
			_errors.push(err);
			res.status(400).json({ errors: err });
		});
	} else if (type === 'image') {
		var _req$body$adpost2 = req.body.adpost,
		    _locations = _req$body$adpost2.locations,
		    _locationtype = _req$body$adpost2.locationtype,
		    _isNotification = _req$body$adpost2.isNotification,
		    _title = _req$body$adpost2.title,
		    images = _req$body$adpost2.images,
		    _category = _req$body$adpost2.category,
		    _hashtags = _req$body$adpost2.hashtags; //eslint-disable-line

		var _errors2 = [];
		if (_hashtags.length > 0) {
			_hashtags.map(function (hashtag) {
				_Hashtag2.default.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch(function (err) {
					return _errors2.push(err);
				});
				return null;
			});
		}
		var imagepost = new _AdPost2.default({
			type: type,
			isNotification: _isNotification,
			locations: _locations,
			locationtype: _locationtype,
			title: _title,
			images: images,
			category: _category,
			hashtags: _hashtags
		});
		imagepost.save().then(function (imagepostRecord) {
			var adpost = {};
			adpost._id = imagepostRecord._id;
			adpost.category = imagepostRecord.category;
			adpost.comments_count = imagepostRecord.comments_count;
			adpost.downvotes_count = imagepostRecord.downvotes_count;
			adpost.upvotes_count = imagepostRecord.upvotes_count;
			adpost.hashtags = imagepostRecord.hashtags;
			adpost.images = imagepostRecord.images;
			adpost.title = imagepostRecord.title;
			adpost.type = imagepostRecord.type;

			_Admin2.default.findOneAndUpdate({ name: "Admin" }, { $push: { posts: imagepostRecord._id } }).catch(function (err) {
				return _errors2.push(err);
			});

			/* const action = "create";
   const newactivity = new Activity({ 
   	action, 
   	postId: imagepostRecord._id, 
   	user: sessionId 
   });
   newactivity.save()
   	.then(activity => {
   		User.findOneAndUpdate(
   			{ sessionId },
   			{ $push: { activity: activity._id } }	// eslint-disable-line
   		).catch(err => errors.push(err));
   	}).catch(err => {
   		errors.push(err);
   		res.status(400).json({ errors });
   	}); */

			res.json({ post: adpost });
		}).catch(function (err) {
			_errors2.push(err);
			res.status(400).json({ errors: _errors2 });
		});
	} else if (type === 'video') {
		var _req$body$adpost3 = req.body.adpost,
		    _locations2 = _req$body$adpost3.locations,
		    _locationtype2 = _req$body$adpost3.locationtype,
		    _isNotification2 = _req$body$adpost3.isNotification,
		    _title2 = _req$body$adpost3.title,
		    videos = _req$body$adpost3.videos,
		    _category2 = _req$body$adpost3.category,
		    _hashtags2 = _req$body$adpost3.hashtags; // eslint-disable-line

		var _errors3 = [];
		if (_hashtags2.length > 0) {
			_hashtags2.map(function (hashtag) {
				_Hashtag2.default.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch(function (err) {
					return _errors3.push(err);
				});
				return null;
			});
		}
		var videopost = new _AdPost2.default({
			type: type,
			isNotification: _isNotification2,
			locationtype: _locationtype2,
			locations: _locations2,
			title: _title2,
			videos: videos,
			category: _category2,
			hashtags: _hashtags2
		});
		videopost.save().then(function (videopostRecord) {
			var adpost = {};
			adpost._id = videopostRecord._id;
			adpost.category = videopostRecord.category;
			adpost.comments_count = videopostRecord.comments_count;
			adpost.downvotes_count = videopostRecord.downvotes_count;
			adpost.upvotes_count = videopostRecord.upvotes_count;
			adpost.hashtags = videopostRecord.hashtags;
			adpost.videos = videopostRecord.videos;
			adpost.title = videopostRecord.title;
			adpost.type = videopostRecord.type;

			_Admin2.default.findOneAndUpdate({ name: "Admin" }, { $push: { posts: videopostRecord._id } }).catch(function (err) {
				return _errors3.push(err);
			});

			/* const action = "create";
   const newactivity = new Activity({ 
   	action, 
   	postId: videopostRecord._id, 
   	user: sessionId 
   });
   newactivity.save()
   	.then(activity => {
   		User.findOneAndUpdate(
   			{ sessionId },
   			{ $push: { activity: activity._id } }	// eslint-disable-line
   		).catch(err => errors.push(err));
   	}).catch(err => {
   		errors.push(err);
   		res.status(400).json({ errors });
   	}); */

			res.json({ post: adpost });
		}).catch(function (err) {
			_errors3.push(err);
			res.status(400).json({ errors: _errors3 });
		});
	} else {
		res.send(400).json({ err: { global: "Something went wrong at the front end at type." } });
	}
});

router.post("/fetchAdPosts/:per/:page", _authenticate2.default, function (req, res) {
	var _req$currentUser = req.currentUser,
	    location_country = _req$currentUser.location_country,
	    location_state = _req$currentUser.location_state,
	    location_city = _req$currentUser.location_city;

	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;
	var query = {};

	var options = {
		select: '-locations -locationtype -isNotification -dateCreated -upvotes -downvotes -comments -reports -reports_count',
		sort: { upvotes_count: -1 },
		lean: true,
		page: pageNo,
		limit: limit
	};

	_AdPost2.default.paginate(query, options).then(function (posts) {
		res.json({ posts: posts });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

router.post("/fetchAdPostsForAdmin/:per/:page", function (req, res) {
	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;
	var query = {};

	var options = {
		select: '-upvotes -downvotes',
		sort: { dateCreated: -1 },
		lean: true,
		page: pageNo,
		limit: limit
	};

	_AdPost2.default.paginate(query, options).then(function (posts) {
		res.json({ posts: posts });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

router.post("/findbyid", function (req, res) {
	var id = req.body.id;


	_AdPost2.default.findOne({ _id: id }).then(function (postRecord) {
		var post = {};
		post._id = postRecord._id;
		post.category = postRecord.category;
		post.comments_count = postRecord.comments_count;
		post.downvotes_count = postRecord.downvotes_count;
		post.upvotes_count = postRecord.upvotes_count;
		post.hashtags = postRecord.hashtags;
		post.location_city = postRecord.location_city;
		post.location_state = postRecord.location_state;
		post.location_country = postRecord.location_country;
		post.title = postRecord.title;
		post.type = postRecord.type;

		if (post.type === "text") {
			post.text = postRecord.text;
			post.isCardStyle = postRecord.isCardStyle;
			post.cardColor = postRecord.cardColor;
		} else if (post.type === "image") post.images = postRecord.images;else if (post.type === "video") post.videos = postRecord.videos;

		res.json({ post: post });
	}).catch(function (err) {
		return res.status(400).json({ err: { global: err } });
	});
});

// //////////////////////// Upvoting

// Upvoting a post
router.post("/upvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;

	var errors = [];

	_AdPost2.default.updateOne({ _id: postId, upvotes: { "$ne": sessionId } }, // Search for the requested post not has user id (i.e, user has not upvoted earlier)
	{ "$inc": { upvotes_count: 1 }, "$push": { "upvotes": sessionId } // If not has, increment upvote and push the user id into upvotes array.
	}).then(function () {
		var action = "upvote";
		var newactivity = new _Activity2.default({ action: action, postId: postId, user: sessionId });
		newactivity.save().then(function (activity) {
			User.findOneAndUpdate({ sessionId: sessionId }, { $push: { activity: activity._id } // eslint-disable-line
			}).catch(function (err) {
				return errors.push(err);
			});
		}).catch(function (err) {
			errors.push(err);
		});

		res.json({ success: true });
	}).catch(function (err) {
		errors.push(err);
		res.status(400).json({ errors: { global: errors } });
	});
});

// Removing Upvote for a post
router.post("/removeupvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;


	_AdPost2.default.updateOne({ _id: postId, upvotes: sessionId }, // Search for the requested post has user id (i.e, user has upvoted earlier)
	{ "$inc": { upvotes_count: -1 }, "$pull": { "upvotes": sessionId } // If not has, increment upvote and push the user id into upvotes array.
	}).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// //////////////////////////// downvoting

// Downvoting a post
router.post("/downvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;


	var errors = [];
	_AdPost2.default.updateOne({ _id: postId, downvotes: { "$ne": sessionId } }, // Search for the requested post not has user id (i.e, user has not upvoted earlier)
	{ "$inc": { downvotes_count: 1 }, "$push": { "downvotes": sessionId } // If not has, increment upvote and push the user id into downvotes array.
	}).then(function () {
		var action = "downvote";
		var newactivity = new _Activity2.default({ action: action, postId: postId, user: sessionId });
		newactivity.save().then(function (activity) {
			User.findOneAndUpdate({ sessionId: sessionId }, { $push: { activity: activity._id } // eslint-disable-line
			}).catch(function (err) {
				return errors.push(err);
			});
		}).catch(function (err) {
			errors.push(err);
		});

		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Removing Upvote for a post
router.post("/removedownvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;


	_AdPost2.default.updateOne({ _id: postId, downvotes: sessionId }, // Search for the requested post has user id (i.e, user has upvoted earlier)
	{ "$inc": { downvotes_count: -1 }, "$pull": { "downvotes": sessionId } // If not has, increment upvote and push the user id into downvotes array.
	}).then(function () {
		res.json({ success: true });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// ////////////////// Check whether a user has upvoted or not
router.post("/hasupvoted", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;


	_AdPost2.default.findOne({ _id: postId }, {
		upvotes_count: 1,
		upvotes: {
			"$elemMatch": { "$eq": sessionId }
		}
	}).then(function (user) {
		if (user.upvotes.length > 0) {
			res.json({ upvoted: true });
		} else {
			res.json({ upvoted: false });
		}
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// ////////////////// Check whether a user has downvoted or not
router.post("/hasdownvoted", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;


	_AdPost2.default.findOne({ _id: postId }, {
		upvotes_count: 1,
		downvotes: {
			"$elemMatch": { "$eq": sessionId }
		}
	}).then(function (user) {
		if (user.downvotes.length > 0) {
			res.json({ downvoted: true });
		} else {
			res.json({ downvoted: false });
		}
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// ////////////Get votes of a post
router.post("/getVotes", _authenticate2.default, function (req, res) {
	var postId = req.body.postId;

	_AdPost2.default.findOne({ _id: postId }).then(function (post) {
		res.json({ success: true, upvotes_count: post.upvotes_count, downvotes_count: post.downvotes_count });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// /////////////////////////// Comments

router.post("/insertComment", _authenticate2.default, function (req, res) {
	var _req$body = req.body,
	    postId = _req$body.postId,
	    commenttext = _req$body.commenttext;
	var sessionId = req.currentUser.sessionId;

	var newcomment = new _Comment2.default({ text: commenttext, postId: postId });

	newcomment.save().then(function (Comment) {
		_AdPost2.default.findOneAndUpdate({ _id: postId }, { $push: { comments: Comment._id }, $inc: { comments_count: 1 } }, { fields: "comments" }).then(function () {
			if (Comment) {
				var comment = {};
				comment.upvotes_count = Comment.upvotes_count;
				comment.downvotes_count = Comment.downvotes_count;
				comment.postId = Comment.postId;
				comment.posted = Comment.posted;
				comment.text = Comment.text;
				comment._id = Comment._id;

				var _errors4 = [];
				var action = "comment";
				var newactivity = new _Activity2.default({ action: action, postId: postId, user: sessionId });
				newactivity.save().then(function (activity) {
					User.findOneAndUpdate({ sessionId: sessionId }, { $push: { activity: activity._id } // eslint-disable-line
					}).catch(function (err) {
						return _errors4.push(err);
					});
				}).catch(function (err) {
					_errors4.push(err);
				});

				res.json({ comment: comment });
			} else {
				// res.status(400).json({ errors: { global: "Something went wrong" } });	
				errors.push("Something went wrong");
			}
		}).catch(function (err) {
			return res.status(400).json({ errors: { global: err } });
		});
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Get all comments
router.post("/allComments/:per/:page", _authenticate2.default, function (req, res) {
	var postId = req.body.postId;


	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;
	var query = { postId: postId };
	var options = {
		select: '-upvotes -downvotes',
		sort: { posted: -1 },
		lean: true,
		limit: limit,
		page: pageNo

		/* AdPost.findOne({ _id: postId }, 'comments' )
  	.populate('comments')
  	// .sort({ posted: -1 })
  	.exec((err, comments) => {
  		if(err) {
  			return res.status(400).json({ errors: { global: err } });
  		}
  
  		res.json({ comments: comments.comments });
  	}); */
	};_Comment2.default.paginate(query, options).then(function (comments) {
		res.json({ comments: comments });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Get comments count
router.post("/getCommentsCount", _authenticate2.default, function (req, res) {
	var postId = req.body.postId;

	_AdPost2.default.findOne({ _id: postId }, 'comments_count').then(function (comments_count) {
		res.json({ comments_count: comments_count });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// ----------------------------------------------------------------------------
// Reports

router.post("/insertReport", _authenticate2.default, function (req, res) {
	var _req$body2 = req.body,
	    postId = _req$body2.postId,
	    reason = _req$body2.reason;
	var sessionId = req.currentUser.sessionId;


	var newreport = new _Report2.default({
		author: sessionId,
		postId: postId,
		reason: reason
	});
	newreport.save().then(function (report) {
		var errors = [];
		var action = "report";
		var newactivity = new _Activity2.default({ action: action, postId: postId, user: sessionId });
		newactivity.save().then(function (activity) {
			User.findOneAndUpdate({ sessionId: sessionId }, { $push: { activity: activity._id } // eslint-disable-line
			}).catch(function (err) {
				return errors.push(err);
			});
		}).catch(function (err) {
			return errors.push(err);
		});

		_AdPost2.default.findOneAndUpdate({ _id: postId }, { $push: { reports: report._id }, $inc: { reports_count: 1 } }).then(function (Post) {
			if (Post) {
				res.json({ success: true });
			} else {
				errors.push("Something went wrong");
			}
		}).catch(function (err) {
			return errors.push(err);
		});
	}).catch(function (err) {
		errors.push(err);
		res.status(400).json({ errors: { global: err } });
	});
});

router.get("/check/:per/:page/:city/:state/:country", function (req, res) {

	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;
	var city = req.params.city;
	var state = req.params.state;
	var country = req.params.country;
	/* let query = [{
 		"$cond": {
 			"if": {
 				"$eq": [ "locationtype", "all" ]
 			},
 			"then": {
 				"$match": [{
 					"$cond": {
 						"if": {
 							"$neq": [ "locations.location_city", "" ]
 						},
 						"then": {
 							"$neq": [ "locations.location_city", "" ]
 						},
 						"else": {
 							"if": {
 								"$neq": [ "locations.location_state", "" ]
 							},
 							"then": {
 								"$eq": [ "locations.location_state", "" ]
 							},
 							"else": {
 								"$eq": [ "locations.location_country", "" ]
 							}
 						}
 					}
 				}]
 			},
 			"else": {
 				"if": {
 					"$eq": [ "locationtype", "locationstoshow" ]
 				},
 				"then": {
 					"$match": [{
 						"$cond": {
 							"if": {
 								"$neq": [ "locations.location_city", "" ]
 							},
 							"then": {
 								"$eq": [ "locations.location_city", `${city}` ]
 							},
 							"else": {
 								"if": {
 									"$neq": [ "locations.location_state", "" ]
 								},
 								"then": {
 									"$eq": [ "locations.location_state", `${state}` ]
 								},
 								"else": {
 									"$eq": [ "locations.location_country", `${country}` ]
 								}
 							}
 						}
 					}]
 				},
 				"else": {
 					"if": {
 						"$eq": [ "locationtype", "locationsnottoshow" ]
 					},
 					"then": {
 						"$match": [{
 							"$cond": {
 								"if": {
 									"$neq": [ "locations.location_city", "" ]
 								},
 								"then": {
 									"$neq": [ "locations.location_city", `${city}` ]
 								},
 								"else": {
 									"if": {
 										"$neq": [ "locations.location_state", "" ]
 									},
 									"then": {
 										"$neq": [ "locations.location_state", `${state}` ]
 									},
 									"else": {
 										"$neq": [ "locations.location_country", `${country}` ]
 									}
 								}
 							}
 						}]
 					},	
 				}
 			}
 		}
 	}]; */
	var query = {};

	var options = {
		limit: 10,
		page: pageNo
	};

	_AdPost2.default.aggregatePaginate(query, options).then(function (docs) {
		res.json(docs);
	}).catch(function (err) {
		res.status(400).json({ errors: err });
	});
});

router.get("/check2/:per/:page/:city/:state/:country", function (req, res) {
	var filter = function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(docs) {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
						case "end":
							return _context.stop();
					}
				}
			}, _callee, this);
		}));

		return function filter(_x) {
			return _ref.apply(this, arguments);
		};
	}();

	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;
	var city = req.params.city;
	var state = req.params.state;
	var country = req.params.country;
	var query = {};

	var options = {
		limit: limit,
		page: pageNo,
		lean: true
	};

	var result = [];


	_AdPost2.default.paginate(query, options).then(function (docs) {
		if (docs) {
			var resultPromise = [];
			resultPromise.push(new Promise(function (resolve, reject) {
				for (var i = docs.length - 1; i >= 0; i--) {
					console.log(docs[i]);
					if (docs[i].locationtype == "all") {
						resolve(docs[i]);
					} else if (docs[i].locationtype == "locationstoshow") {
						for (var j = docs[i].locations.length - 1; j >= 0; j--) {
							if (docs[j].locations[j].city && docs[j].locations[j].city == city) {
								resolve(docs[i]);
								break;
							} else if (docs[j].locations[j].state && docs[j].locations[j].state == state) {
								resolve(docs[i]);
								break;
							} else if (docs[j].locations[j].country && docs[j].locations[j].country == country) {
								resolve(docs[i]);
								break;
							}
						}
					}
				}
			}));

			Promise.all(resultPromise).then(function (_ref2) {
				var _ref3 = _slicedToArray(_ref2, 1),
				    result = _ref3[0];

				console.log(result);
				res.json({ d: { docs: result, totalPages: docs.totalPages } });
			});
		}
	}).catch(function (err) {
		return res.status(400).json({ err: err });
	});
});

// Delete post
router.post("/deleteAdPost", function (req, res) {
	var id = req.body.id;

	_AdPost2.default.findOne({ _id: id }).deleteOne(function () {
		res.json({ success: true });
	}).catch(function (err) {
		res.status(400).json({ success: false });
	});
});

exports.default = router;