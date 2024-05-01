"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Post = require("../models/Post");

var _Post2 = _interopRequireDefault(_Post);

var _Comment = require("../models/Comment");

var _Comment2 = _interopRequireDefault(_Comment);

var _Hashtag = require("../models/Hashtag");

var _Hashtag2 = _interopRequireDefault(_Hashtag);

var _Report = require("../models/Report");

var _Report2 = _interopRequireDefault(_Report);

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _Activity = require("../models/Activity");

var _Activity2 = _interopRequireDefault(_Activity);

var _Pouvconn = require("../models/Pouvconn");

var _Pouvconn2 = _interopRequireDefault(_Pouvconn);

var _Podvconn = require("../models/Podvconn");

var _Podvconn2 = _interopRequireDefault(_Podvconn);

var _authenticate = require("../middlewares/authenticate");

var _authenticate2 = _interopRequireDefault(_authenticate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// router.use(authenticate);

// import parseErrors from "../utils/parseErrors";
router.get("/", function (req, res) {
	res.send("Hi I am textpost! I am working too.");
});

// inserting a post
router.post("/insert", _authenticate2.default, function (req, res) {
	var type = req.body.post.type;
	var sessionId = req.currentUser.sessionId;

	/* eslint-disable */

	if (type === 'text') {
		var _req$body$post = req.body.post,
		    location_city = _req$body$post.location_city,
		    location_state = _req$body$post.location_state,
		    location_country = _req$body$post.location_country,
		    title = _req$body$post.title,
		    text = _req$body$post.text,
		    category = _req$body$post.category,
		    hashtags = _req$body$post.hashtags,
		    isCardStyle = _req$body$post.isCardStyle,
		    cardColor = _req$body$post.cardColor;

		var _errors = [];
		if (location_country === "") {
			location_city = req.currentUser.location_city;
			location_state = req.currentUser.location_state;
			location_country = req.currentUser.location_country;
		}
		if (hashtags.length > 0) {
			hashtags.map(function (hashtag) {
				_Hashtag2.default.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch(function (err) {
					return _errors.push(err.message);
				});
				return null;
			});
		}
		var textpost = new _Post2.default({
			type: type,
			author: sessionId,
			location_city: location_city,
			location_state: location_state,
			location_country: location_country,
			title: title,
			text: text,
			category: category,
			hashtags: hashtags,
			isCardStyle: isCardStyle,
			cardColor: cardColor
		});
		textpost.save().then(function (textpostRecord) {
			var post = {};
			post._id = textpostRecord._id;
			post.category = textpostRecord.category;
			post.comments_count = textpostRecord.comments_count;
			post.downvotes_count = textpostRecord.downvotes_count;
			post.upvotes_count = textpostRecord.upvotes_count;
			post.hashtags = textpostRecord.hashtags;
			post.location_city = textpostRecord.location_city;
			post.location_state = textpostRecord.location_state;
			post.location_country = textpostRecord.location_country;
			post.text = textpostRecord.text;
			post.title = textpostRecord.title;
			post.type = textpostRecord.type;
			post.isCardStyle = textpostRecord.isCardStyle;
			post.cardColor = textpostRecord.cardColor;

			var action = "create";
			var newactivity = new _Activity2.default({
				action: action,
				postId: textpostRecord._id,
				user: sessionId
			});
			newactivity.save().catch(function (err) {
				_errors.push(err.message);
				res.status(400).json({ errors: _errors });
			});

			res.json({ post: post });
		}).catch(function (err) {
			_errors.push(err.message);
			res.status(400).json({ errors: err });
		});
	} else if (type === 'image') {
		var _req$body$post2 = req.body.post,
		    _location_city = _req$body$post2.location_city,
		    _location_state = _req$body$post2.location_state,
		    _location_country = _req$body$post2.location_country,
		    _title = _req$body$post2.title,
		    images = _req$body$post2.images,
		    _category = _req$body$post2.category,
		    _hashtags = _req$body$post2.hashtags; //eslint-disable-line

		var _errors2 = [];
		if (_location_country === "") {
			_location_city = req.currentUser.location_city;
			_location_state = req.currentUser.location_state;
			_location_country = req.currentUser.location_country;
		}
		if (_hashtags.length > 0) {
			_hashtags.map(function (hashtag) {
				_Hashtag2.default.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch(function (err) {
					return _errors2.push(err.message);
				});
				return null;
			});
		}
		var imagepost = new _Post2.default({
			type: type,
			author: sessionId,
			location_city: _location_city,
			location_state: _location_state,
			location_country: _location_country,
			title: _title,
			images: images,
			category: _category,
			hashtags: _hashtags
		});
		imagepost.save().then(function (imagepostRecord) {
			var post = {};
			post._id = imagepostRecord._id;
			post.category = imagepostRecord.category;
			post.comments_count = imagepostRecord.comments_count;
			post.downvotes_count = imagepostRecord.downvotes_count;
			post.upvotes_count = imagepostRecord.upvotes_count;
			post.hashtags = imagepostRecord.hashtags;
			post.location_city = imagepostRecord.location_city;
			post.location_state = imagepostRecord.location_state;
			post.location_country = imagepostRecord.location_country;
			post.images = imagepostRecord.images;
			post.title = imagepostRecord.title;
			post.type = imagepostRecord.type;

			var action = "create";
			var newactivity = new _Activity2.default({
				action: action,
				postId: imagepostRecord._id,
				user: sessionId
			});
			newactivity.save().catch(function (err) {
				_errors2.push(err.message);
				res.status(400).json({ errors: _errors2 });
			});

			res.json({ post: post });
		}).catch(function (err) {
			_errors2.push(err.message);
			res.status(400).json({ errors: _errors2 });
		});
	} else if (type === 'video') {
		var _req$body$post3 = req.body.post,
		    _location_city2 = _req$body$post3.location_city,
		    _location_state2 = _req$body$post3.location_state,
		    _location_country2 = _req$body$post3.location_country,
		    _title2 = _req$body$post3.title,
		    videos = _req$body$post3.videos,
		    _category2 = _req$body$post3.category,
		    _hashtags2 = _req$body$post3.hashtags; // eslint-disable-line

		var _errors3 = [];
		if (_location_country2 === "") {
			_location_city2 = req.currentUser.location_city;
			_location_state2 = req.currentUser.location_state;
			_location_country2 = req.currentUser.location_country;
		}
		if (_hashtags2.length > 0) {
			_hashtags2.map(function (hashtag) {
				_Hashtag2.default.findOneAndUpdate({ hashtag: hashtag }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch(function (err) {
					return _errors3.push(err.message);
				});
				return null;
			});
		}
		var videopost = new _Post2.default({
			type: type,
			author: sessionId,
			location_city: _location_city2,
			location_state: _location_state2,
			location_country: _location_country2,
			title: _title2,
			videos: videos,
			category: _category2,
			hashtags: _hashtags2
		});
		videopost.save().then(function (videopostRecord) {
			var post = {};
			post._id = videopostRecord._id;
			post.category = videopostRecord.category;
			post.comments_count = videopostRecord.comments_count;
			post.downvotes_count = videopostRecord.downvotes_count;
			post.upvotes_count = videopostRecord.upvotes_count;
			post.hashtags = videopostRecord.hashtags;
			post.location_city = videopostRecord.location_city;
			post.location_state = videopostRecord.location_state;
			post.location_country = videopostRecord.location_country;
			post.videos = videopostRecord.videos;
			post.title = videopostRecord.title;
			post.type = videopostRecord.type;

			var action = "create";
			var newactivity = new _Activity2.default({
				action: action,
				postId: videopostRecord._id,
				user: sessionId
			});
			newactivity.save().catch(function (err) {
				_errors3.push(err.message);
				res.status(400).json({ errors: _errors3 });
			});

			res.json({ post: post });
		}).catch(function (err) {
			_errors3.push(err.message);
			res.status(400).json({ errors: _errors3 });
		});
	} else {
		res.send(400).json({ err: { global: "Something went wrong at the front end at type." } });
	}
});

router.post("/findbyid", function (req, res) {
	var id = req.body.id;


	_Post2.default.findOne({ _id: id }).then(function (postRecord) {
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

// return local posts by per page and page number
router.post("/fetchLocalPostsByFilter/:per/:page", _authenticate2.default, function (req, res) {
	var _req$body = req.body,
	    filter = _req$body.filter,
	    category = _req$body.category,
	    isAltLoc = _req$body.isAltLoc;


	var query = {};
	if (!isAltLoc) {
		var location_city = req.currentUser.location_city; // eslint-disable-line

		query = { location_city: location_city };
	} else {
		var _req$body$loc = req.body.loc,
		    _location_city3 = _req$body$loc.location_city,
		    location_state = _req$body$loc.location_state,
		    location_country = _req$body$loc.location_country;

		if (_location_city3) query = { location_city: _location_city3 };else if (location_state) query = { location_state: location_state };else if (location_country) query = { location_country: location_country };else query = { location_city: req.currentUser.location_city };
	}

	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;
	if (category !== "all") query.category = category;

	if (filter === "Loved") {
		/* Post.find({ location: location_city })
  	.sort({ upvotes_count: -1 })
  	.skip(size * (pageNo - 1))
  	.limit(size)
  	.then(posts => {
  		const totalCount = posts.length;
  		const totalPages = Math.ceil(totalCount/size);
  		res.json({ 
  			posts, 
  			per: size,
  			page: pageNo,
  			total_pages: totalCount,
  			has_more: totalPages - pageNo
  		})
  	})
  	.catch(err => res.status(400).json({ err: { global: err } })); */

		var options = {
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { upvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(query, options).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else if (filter === "Latest") {
		/* Post.find({ location: location_city })
  	.sort({ dateCreated: -1 })
  	.limit(10)
  	.then(posts => res.json({ posts }))
  	.catch(err => res.status(400).json({ err: { global: err } })); */

		var _options = {
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { dateCreated: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(query, _options).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else if (filter === "Hated") {
		/* Post.find({ location: location_city })
  	.sort({ downvotes_count: -1 })
  	.limit(10)
  	.then(posts => res.json({ posts }))
  	.catch(err => res.status(400).json({ err: { global: err } })); */

		var _options2 = {
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { downvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(query, _options2).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else {
		res.status(400).json({ err: { global: "Something went wrong at client side at filter" } });
	}
});

// return global posts by per page and page number
router.post("/fetchGlobalPostsByFilter/:per/:page", function (req, res) {
	var _req$body2 = req.body,
	    filter = _req$body2.filter,
	    category = _req$body2.category;


	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);

	var limit = size;
	var query = {};

	if (category !== "all") query.category = category;

	if (filter === "Loved") {
		var options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { upvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(query, options).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else if (filter === "Latest") {
		var _options3 = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { dateCreated: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(query, _options3).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else if (filter === "Hated") {
		var _options4 = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { downvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(query, _options4).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else {
		res.status(400).json({ err: { global: "Something went wrong at client side at filter" } });
	}
});

// return posts by taking filters for search bar (in client site and admin panel)
router.post("/fetchPostsBySearchFilter/:per/:page", function (req, res) {
	var _req$body3 = req.body,
	    filter = _req$body3.filter,
	    country = _req$body3.country,
	    state = _req$body3.state,
	    city = _req$body3.city,
	    hashtag = _req$body3.hashtag,
	    category = _req$body3.category;
	var textquery = req.body.textquery;


	var queryCond = {};
	if (country) queryCond.location_country = country;
	if (state) queryCond.location_state = state;
	if (city) queryCond.location_city = city;
	if (hashtag) queryCond.hashtags = hashtag;
	if (category) queryCond.category = category;
	if (textquery) {
		// queryCond.title={"$regex": textquery, "$options": "i"};
		// queryCond.text={"$regex": textquery, "$options": "i"};
		queryCond.$text = { $search: textquery };
	}
	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var limit = size;

	/* const query = {
 	category,
 	location_country: country,
 	location_state: state,
 	location_city: city
 }; */

	if (filter === "Loved") {
		var options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { upvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(queryCond, options).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else if (filter === "Latest") {
		var _options5 = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { dateCreated: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(queryCond, _options5).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else if (filter === "Hated") {
		var _options6 = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { downvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit: limit
		};

		_Post2.default.paginate(queryCond, _options6).then(function (posts) {
			res.json({ posts: posts });
		}).catch(function (err) {
			return res.status(400).json({ err: { global: err } });
		});
	} else {
		res.status(400).json({ err: { global: "Something went wrong at client side at filter" } });
	}
});

// //////////////////////// Upvoting

// Upvoting a post
router.post("/upvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;

	/* Post.updateOne(
 	{ _id: postId, upvotes: { "$ne": sessionId }},	// Search for the requested post not has user id (i.e, user has not upvoted earlier)
 	{ "$inc": { upvotes_count: 1 }, "$push": { "upvotes": sessionId } }	// If not has, increment upvote and push the user id into upvotes array.
 ).then(() => {
 	const action = "upvote";
 	const newactivity = new Activity({ action, postId, user: sessionId });
 	newactivity.save()
 		.then(() => {
 			User.findOneAndUpdate(
 				{ sessionId },
 				{ $inc: {upvotes_given: 1} }	// eslint-disable-line
 			).catch(err => errors.push(err.message));
 		}).catch(err => {
 			errors.push(err.message);
 		});
 
 	res.json({ success: true });
 }).catch(err => res.status(400).json({ errors: { global: err } })); */

	_Pouvconn2.default.findOne({ sessionId: sessionId, postId: postId }).then(function (doc) {
		if (doc) {
			res.json({});
		} else {
			var newdoc = new _Pouvconn2.default({ sessionId: sessionId, postId: postId });
			newdoc.save().then(function () {
				var action = "upvote";
				var newactivity = new _Activity2.default({ action: action, postId: postId, user: sessionId });
				newactivity.save().catch(function (err) {
					errors.push(err.message);
				});

				_User2.default.findOneAndUpdate({ sessionId: sessionId }, { $inc: { upvotes_given: 1 } }).catch(function (err) {
					return errors.push(err.message);
				});

				_Post2.default.findOneAndUpdate({ _id: postId }, { $inc: { upvotes_count: 1 } }).catch(function (err) {
					return errors.push(err.message);
				});

				res.json({ success: true });
			}).catch(function (err) {
				return errors.push(err.message);
			});
		}
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: errors });
	});
});

// Removing Upvote for a post
router.post("/removeupvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;

	/* Post.updateOne(
 	{ _id: postId, upvotes: sessionId },	// Search for the requested post has user id (i.e, user has upvoted earlier)
 	{ "$inc": { upvotes_count: -1 }, "$pull": { "upvotes": sessionId } }	// If not has, increment upvote and push the user id into upvotes array.
 ).then(() => {
 	User.findOneAndUpdate(
 		{ sessionId },
 		{ $inc: {upvotes_given: -1} }	// eslint-disable-line
 	).catch(err => errors.push(err.message));
 	res.json({ success: true });
 }).catch(err => res.status(400).json({ errors: { global: err } })); */

	_Pouvconn2.default.findOne({ sessionId: sessionId, postId: postId }).deleteOne(function () {
		_User2.default.findOneAndUpdate({ sessionId: sessionId }, { $inc: { upvotes_given: -1 } // eslint-disable-line
		}).catch(function (err) {
			return errors.push(err.message);
		});

		_Post2.default.findOneAndUpdate({ _id: postId }, { $inc: { upvotes_count: -1 } }).catch(function (err) {
			return errors.push(err.message);
		});

		res.json({ success: true });
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: errors });
	});
});

// //////////////////////////// downvoting

// Downvoting a post
router.post("/downvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;

	/* Post.updateOne(
 	{ _id: postId, downvotes: { "$ne": sessionId }},	// Search for the requested post not has user id (i.e, user has not upvoted earlier)
 	{ "$inc": { downvotes_count: 1 }, "$push": { "downvotes": sessionId } }	// If not has, increment upvote and push the user id into downvotes array.
 ).then(() => {
 	const action = "downvote";
 	const newactivity = new Activity({ action, postId, user: sessionId });
 	newactivity.save()
 		.then(() => {
 			User.findOneAndUpdate(
 				{ sessionId },
 				{ $inc: {downvotes_given: 1} }	// eslint-disable-line
 			).catch(err => errors.push(err.message));
 		}).catch(err => {
 			errors.push(err.message);
 		});
 
 	res.json({ success: true });
 }).catch(err => res.status(400).json({ errors: { global: err } })); */

	_Podvconn2.default.findOne({ sessionId: sessionId, postId: postId }).then(function (doc) {
		if (doc) {
			res.json({});
		} else {
			var newdoc = new _Podvconn2.default({ sessionId: sessionId, postId: postId });
			newdoc.save().then(function () {
				var action = "downvote";
				var newactivity = new _Activity2.default({ action: action, postId: postId, user: sessionId });
				newactivity.save().catch(function (err) {
					errors.push(err.message);
				});

				_User2.default.findOneAndUpdate({ sessionId: sessionId }, { $inc: { downvotes_given: 1 } // eslint-disable-line
				}).catch(function (err) {
					return errors.push(err.message);
				});

				_Post2.default.findOneAndUpdate({ _id: postId }, { "$inc": { downvotes_count: 1 } }).catch(function (err) {
					return errors.push(err.message);
				});

				res.json({ success: true });
			}).catch(function (err) {
				return errors.push(err.message);
			});
		}
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: errors });
	});
});

// Removing Upvote for a post
router.post("/removedownvote", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;

	/* Post.updateOne(
 	{ _id: postId, downvotes: sessionId },	// Search for the requested post has user id (i.e, user has upvoted earlier)
 	{ "$inc": { downvotes_count: -1 }, "$pull": { "downvotes": sessionId } }	// If not has, increment upvote and push the user id into downvotes array.
 ).then(() => {
 	User.findOneAndUpdate(
 		{ sessionId },
 		{ $inc: {downvotes_given: -1} }	// eslint-disable-line
 	).catch(err => errors.push(err.message));
 	res.json({ success: true });
 }).catch(err => res.status(400).json({ errors: { global: err } })); */

	_Podvconn2.default.findOne({ sessionId: sessionId, postId: postId }).deleteOne(function () {
		_User2.default.findOneAndUpdate({ sessionId: sessionId }, { $inc: { downvotes_given: -1 } }).catch(function (err) {
			return errors.push(err.message);
		});

		_Post2.default.findOneAndUpdate({ _id: postId }, { $inc: { downvotes_count: -1 } }).catch(function (err) {
			return errors.push(err.message);
		});

		res.json({ success: true });
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: errors });
	});
});

// ////////////////// Check whether a user has upvoted or not
router.post("/hasupvoted", _authenticate2.default, function (req, res) {
	var sessionId = req.currentUser.sessionId;
	var postId = req.body.postId;

	/* Post.findOne(
 	{ _id: postId },
 	{
 		upvotes_count: 1,
 		upvotes: {
 			"$elemMatch": { "$eq": sessionId }
 		}
 	}
 ).then(user => {	
 	if(user.upvotes.length > 0) {
 		res.json({ upvoted: true })
 	} else {
 		res.json({ upvoted: false })
 	}
 }).catch(err => res.status(400).json({ errors: { global: err } })); */

	_Pouvconn2.default.findOne({ sessionId: sessionId, postId: postId }).then(function (doc) {
		if (doc) {
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

	/* Post.findOne(
 	{ _id: postId },
 	{
 		upvotes_count: 1,
 		downvotes: {
 			"$elemMatch": { "$eq": sessionId }
 		}
 	}
 ).then(user => {
 	if(user.downvotes.length > 0) {
 		res.json({ downvoted: true })
 	} else {
 		res.json({ downvoted: false })
 	}
 }).catch(err => res.status(400).json({ errors: { global: err } })); */

	_Podvconn2.default.findOne({ sessionId: sessionId, postId: postId }).then(function (doc) {
		if (doc) {
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

	_Post2.default.findOne({ _id: postId }).then(function (post) {
		res.json({ success: true, upvotes_count: post.upvotes_count, downvotes_count: post.downvotes_count });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// /////////////////////////// Comments

router.post("/insertComment", _authenticate2.default, function (req, res) {
	var _req$body4 = req.body,
	    postId = _req$body4.postId,
	    commenttext = _req$body4.commenttext;
	var sessionId = req.currentUser.sessionId;

	var newcomment = new _Comment2.default({ text: commenttext, postId: postId });

	newcomment.save().then(function (Comment) {
		_Post2.default.findOneAndUpdate({ _id: postId }, { $inc: { comments_count: 1 } }).then(function () {
			if (Comment) {
				var comment = {};
				comment.upvotes_count = Comment.upvotes_count;
				comment.downvotes_count = Comment.downvotes_count;
				comment.postId = Comment.postId;
				comment.posted = Comment.posted;
				comment.text = Comment.text;
				comment._id = Comment._id;
				comment.hasupvoted = Comment.hasupvoted;
				comment.hasdownvoted = Comment.hasdownvoted;

				var _errors4 = [];
				var action = "comment";
				var newactivity = new _Activity2.default({ action: action, postId: postId, user: sessionId });
				newactivity.save().then(function () {
					_User2.default.findOneAndUpdate({ sessionId: sessionId }, { $inc: { comments_given: 1 } // eslint-disable-line
					}).catch(function (err) {
						return _errors4.push(err.message);
					});
				}).catch(function (err) {
					_errors4.push(err.message);
				});

				res.json({ comment: comment });
			} else {
				errors.push("Something went wrong");
			}
		}).catch(function (err) {
			return errors.push(err.message);
		});
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// Get all comments
router.post("/allComments/:per/:page", _authenticate2.default, function (req, res) {
	var postId = req.body.postId;
	var sessionId = req.currentUser.sessionId;


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
	};

	var errors = [];
	_Comment2.default.paginate(query, options).then(function (comments) {
		res.json({ comments: comments });
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: { global: err } });
	});
});

// Get comments count
router.post("/getCommentsCount", _authenticate2.default, function (req, res) {
	var postId = req.body.postId;

	_Post2.default.findOne({ _id: postId }, 'comments_count').then(function (comments_count) {
		res.json({ comments_count: comments_count });
	}).catch(function (err) {
		return res.status(400).json({ errors: { global: err } });
	});
});

// ----------------------------------------------------------------------------
// Reports

router.post("/insertReport", _authenticate2.default, function (req, res) {
	var _req$body5 = req.body,
	    postId = _req$body5.postId,
	    reason = _req$body5.reason;
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
		newactivity.save().catch(function (err) {
			return errors.push(err.message);
		});

		_Post2.default.findOneAndUpdate({ _id: postId }, { $push: { reports: { id: report._id, category: reason } }, $inc: { reports_count: 1 } }).then(function (Post) {
			if (Post) {
				res.json({ success: true });
			} else {
				errors.push("Something went wrong");
			}
		}).catch(function (err) {
			return errors.push(err.message);
		});
	}).catch(function (err) {
		errors.push(err.message);
		res.status(400).json({ errors: { global: err } });
	});
});

router.post("/fetchReportedPosts/:per/:page", function (req, res) {
	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);

	var limit = size;
	var query = {};

	var options = {
		// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
		select: '-upvotes -downvotes -comments',
		sort: { reports_count: -1 },
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

router.post("/fetchReportedPostsByFilter/:per/:page", function (req, res) {
	var pageNo = parseInt(req.params.page, 10);
	var size = parseInt(req.params.per, 10);
	var category = req.body.category;


	var limit = size;
	var query = { "reports.category": category };

	var options = {
		// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
		select: '-upvotes -downvotes -comments',
		sort: { reports_count: -1 },
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

// Delete post
router.post("/deletePost", function (req, res) {
	var id = req.body.id;

	_Post2.default.findOne({ _id: id }).deleteOne(function () {
		res.json({ success: true });
	}).catch(function (err) {
		res.status(400).json({ success: false });
	});
});

exports.default = router;