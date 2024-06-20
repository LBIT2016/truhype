import express from "express";

import Post from "../models/Post";
import Comment from "../models/Comment";
import Hashtag from "../models/Hashtag";
import Report from "../models/Report";
import User from "../models/User";
import Activity from "../models/Activity";
import Pouvconn from "../models/Pouvconn";
import Podvconn from "../models/Podvconn";

// import parseErrors from "../utils/parseErrors";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

// router.use(authenticate);

router.get("/", (req, res) => {
	res.send("Hi I am textpost! I am working too.");
});

// inserting a post
router.post("/insert", authenticate, (req, res) => {
	const { type } = req.body.post;
	const { sessionId } = req.currentUser;
	
	/* eslint-disable */
	if(type === 'text') {
		let { 
			location_city,
			location_state,
			location_country, 
			title, 
			text, 
			category, 
			hashtags, 
			isCardStyle, 
			cardColor 
		} = req.body.post;		
		const errors = [];
		if(location_country === "") {
			location_city = req.currentUser.location_city;
			location_state = req.currentUser.location_state;
			location_country = req.currentUser.location_country;
		}
		if(hashtags.length > 0) {
			hashtags.map(hashtag => {
				Hashtag.findOneAndUpdate(
					{ hashtag },
					{ $inc: { count: 1 } },
					{ upsert: true, new: true, setDefaultsOnInsert: true }
				).catch(err => errors.push(err.message));
				return null;
			})
		}
		const textpost = new Post({
			type,
			author: sessionId,
			location_city,
			location_state,
			location_country,
			title,
			text,
			category,
			hashtags,
			isCardStyle,
			cardColor
		});
		textpost.save()
				.then(textpostRecord => {
					let post = {};
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

					const action = "create";
					const newactivity = new Activity({ 
						action, 
						postId: textpostRecord._id, 
						user: sessionId 
					});
					newactivity.save()
						.catch(err => {
							errors.push(err.message);
							res.status(400).json({ errors });
						});
					
					res.json({ post });
				})
				.catch(err => {
					errors.push(err.message);
					res.status(400).json({ errors:err });
				});
	} else if(type === 'image') {
		let { 
			location_city,
			location_state,
			location_country,
			title, 
			images, 
			category, 
			hashtags 
		} = req.body.post;	//eslint-disable-line
		const errors = [];
		if(location_country === "") {
			location_city = req.currentUser.location_city;
			location_state = req.currentUser.location_state;
			location_country = req.currentUser.location_country;
		}
		if(hashtags.length > 0) {
			hashtags.map(hashtag => {
				Hashtag.findOneAndUpdate(
					{ hashtag },
					{ $inc: { count: 1 } },
					{ upsert: true, new: true, setDefaultsOnInsert: true }
				).catch(err => errors.push(err.message));
				return null;
			})
		}
		const imagepost = new Post({
			type,
			author: sessionId,
			location_city,
			location_state,
			location_country,
			title,
			images,
			category,
			hashtags
		});
		imagepost.save()
				.then(imagepostRecord => {
					let post = {};
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

					const action = "create";
					const newactivity = new Activity({ 
						action, 
						postId: imagepostRecord._id, 
						user: sessionId 
					});
					newactivity.save()
						.catch(err => {
							errors.push(err.message);
							res.status(400).json({ errors });
						});
					
					res.json({ post });
				})
				.catch(err => {
					errors.push(err.message);
					res.status(400).json({ errors });
				});
	} else if(type === 'video') {
		let { 
			location_city,
			location_state,
			location_country,
			title, 
			videos, 
			category, 
			hashtags 
		} = req.body.post;	// eslint-disable-line
		const errors = [];
		if(location_country === "") {
			location_city = req.currentUser.location_city;
			location_state = req.currentUser.location_state;
			location_country = req.currentUser.location_country;
		}
		if(hashtags.length > 0) {
			hashtags.map(hashtag => {
				Hashtag.findOneAndUpdate(
					{ hashtag },
					{ $inc: { count: 1 } },
					{ upsert: true, new: true, setDefaultsOnInsert: true }
				).catch(err => errors.push(err.message));
				return null;
			})
		}
		const videopost = new Post({
			type,
			author: sessionId,
			location_city,
			location_state,
			location_country,
			title,
			videos,
			category,
			hashtags
		});
		videopost.save()
				.then(videopostRecord => {
					let post = {};
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

					const action = "create";
					const newactivity = new Activity({ 
						action, 
						postId: videopostRecord._id, 
						user: sessionId 
					});
					newactivity.save()
						.catch(err => {
							errors.push(err.message);
							res.status(400).json({ errors });
						});

					res.json({ post });
				})
				.catch(err => {
					errors.push(err.message);
					res.status(400).json({ errors });
				});
	} else {
		res.send(400).json({ err: { global: "Something went wrong at the front end at type."} });
	}
});

router.post("/findbyid", (req, res) => {
	const { id } = req.body;

	Post.findOne({ _id: id })
		.then(postRecord => {
			let post = {};
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

			if(post.type === "text") {
				post.text = postRecord.text;
				post.isCardStyle = postRecord.isCardStyle;
				post.cardColor = postRecord.cardColor;
			}
			else if(post.type === "image") post.images = postRecord.images;
			else if(post.type === "video") post.videos = postRecord.videos;

			res.json({ post });
		})
		.catch(err => res.status(400).json({ err: { global: err } }));
});	

// return local posts by per page and page number
router.post("/fetchLocalPostsByFilter/:per/:page", authenticate, (req, res) => {
	const { filter, category, isAltLoc } = req.body;

	let query = {};
	if(!isAltLoc) {
		const { location_city } = req.currentUser;	// eslint-disable-line
		query = {location_city};
	} else {
		const { location_city, location_state, location_country } = req.body.loc;
		if(location_city) query = {location_city};
		else if(location_state) query = {location_state};
		else if(location_country) query={location_country};
		else query = {location_city: req.currentUser.location_city};
	}

	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	if(category !== "all") query.category = category;

	if(filter === "Loved") {
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
		
		const options = {
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { upvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit
		}

		Post.paginate(query, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));

	} else if(filter === "Latest") {
		/* Post.find({ location: location_city })
			.sort({ dateCreated: -1 })
			.limit(10)
			.then(posts => res.json({ posts }))
			.catch(err => res.status(400).json({ err: { global: err } })); */
		
		const options = {
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { dateCreated: -1 },
			lean: true,
			page: pageNo,
			limit
		}

		Post.paginate(query, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));

	} else if(filter === "Hated") {
		/* Post.find({ location: location_city })
			.sort({ downvotes_count: -1 })
			.limit(10)
			.then(posts => res.json({ posts }))
			.catch(err => res.status(400).json({ err: { global: err } })); */

		const options = {
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { downvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit
		}
			
		Post.paginate(query, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));

	} else {
		res.status(400).json({ err: { global: "Something went wrong at client side at filter" } });
	}
});

// return global posts by per page and page number
router.post("/fetchGlobalPostsByFilter/:per/:page", (req, res) => {
	const { filter, category } = req.body;

	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	
	const limit = size;
	let query = {};

	if(category !== "all") query.category = category;

	if(filter === "Loved") {
		const options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { upvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit
		}

		Post.paginate(query, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));

	} else if(filter === "Latest") {
		const options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { dateCreated: -1 },
			lean: true,
			page: pageNo,
			limit
		}
			
		Post.paginate(query, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));

	} else if(filter === "Hated") {
		const options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { downvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit
		}
			
		Post.paginate(query, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));
	} else {
		res.status(400).json({ err: { global: "Something went wrong at client side at filter" } });
	}
});

// return posts by taking filters for search bar (in client site and admin panel)
router.post("/fetchPostsBySearchFilter/:per/:page", (req, res) => {
	const { filter, country, state, city, hashtag, category } = req.body;
	let { textquery } = req.body;

	let queryCond = {};
	if(country) queryCond.location_country=country;
	if(state) queryCond.location_state=state;
	if(city) queryCond.location_city=city;
	if(hashtag) queryCond.hashtags=hashtag;
	if(category) queryCond.category=category;
	if(textquery) {
		// queryCond.title={"$regex": textquery, "$options": "i"};
		// queryCond.text={"$regex": textquery, "$options": "i"};
		queryCond.$text={$search: textquery};
	}
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;

	/* const query = {
		category,
		location_country: country,
		location_state: state,
		location_city: city
	}; */

	if(filter === "Loved") {
		const options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { upvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit
		}

		Post.paginate(queryCond, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));

	} else if(filter === "Latest") {
		const options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { dateCreated: -1 },
			lean: true,
			page: pageNo,
			limit
		}
			
		Post.paginate(queryCond, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));
	} else if(filter === "Hated") {
		const options = {
			// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
			select: '-dateCreated -author -upvotes -downvotes -comments -reports -reports_count',
			sort: { downvotes_count: -1 },
			lean: true,
			page: pageNo,
			limit
		}
			
		Post.paginate(queryCond, options).then(posts => {
			res.json({ posts });
		}).catch(err => res.status(400).json({ err: { global: err } }));
	} else {
		res.status(400).json({ err: { global: "Something went wrong at client side at filter" } });
	}
});

// //////////////////////// Upvoting

// Upvoting a post
router.post("/upvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

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
	Pouvconn.findOne({ sessionId, postId })
			.then(doc => {
				if(doc) {
					res.json({});
				} else {
					const newdoc = new Pouvconn({ sessionId, postId });
					newdoc.save()
						.then(() => {
							const action = "upvote";
							const newactivity = new Activity({ action, postId, user: sessionId });
							newactivity.save()
								.catch(err => {
									errors.push(err.message);
								});

							User.findOneAndUpdate(
								{ sessionId },
								{ $inc: {upvotes_given: 1} }	
							).catch(err => errors.push(err.message));

							Post.findOneAndUpdate(
								{ _id: postId },
								{ $inc: { upvotes_count: 1 } }
							).catch(err => errors.push(err.message));

							res.json({ success: true });
						}).catch(err => errors.push(err.message));
				}
			}).catch(err => {
				errors.push(err.message)
				res.status(400).json({ errors });
			});
});

// Removing Upvote for a post
router.post("/removeupvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

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
	
	Pouvconn.findOne({ sessionId, postId })
			.deleteOne(() => {
				User.findOneAndUpdate(
					{ sessionId },
					{ $inc: {upvotes_given: -1} }	// eslint-disable-line
				).catch(err => errors.push(err.message));

				Post.findOneAndUpdate(
					{ _id: postId },
					{ $inc: { upvotes_count: -1 } }
				).catch(err => errors.push(err.message));

				res.json({ success: true });
			}).catch(err => {
				errors.push(err.message)
				res.status(400).json({ errors });
			});
});

// //////////////////////////// downvoting

// Downvoting a post
router.post("/downvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

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

	Podvconn.findOne({ sessionId, postId })
			.then(doc => {
				if(doc) {
					res.json({});
				} else {
					const newdoc = new Podvconn({ sessionId, postId });
					newdoc.save()
						.then(() => {
							const action = "downvote";
							const newactivity = new Activity({ action, postId, user: sessionId });
							newactivity.save()
								.catch(err => {
									errors.push(err.message);
								});

							User.findOneAndUpdate(
								{ sessionId },
								{ $inc: {downvotes_given: 1} }	// eslint-disable-line
							).catch(err => errors.push(err.message));

							Post.findOneAndUpdate(
								{ _id: postId },
								{ "$inc": { downvotes_count: 1 } }
							).catch(err => errors.push(err.message));

							res.json({ success: true });
						}).catch(err => errors.push(err.message));
				}
			}).catch(err => {
				errors.push(err.message)
				res.status(400).json({ errors });
			});
});

// Removing Upvote for a post
router.post("/removedownvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

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

	Podvconn.findOne({ sessionId, postId })
			.deleteOne(() => {
				User.findOneAndUpdate(
					{ sessionId },
					{ $inc: {downvotes_given: -1} }
				).catch(err => errors.push(err.message));

				Post.findOneAndUpdate(
					{ _id: postId },
					{ $inc: { downvotes_count: -1 } }
				).catch(err => errors.push(err.message));

				res.json({ success: true });
			}).catch(err => {
				errors.push(err.message)
				res.status(400).json({ errors });
			});
});

// ////////////////// Check whether a user has upvoted or not
router.post("/hasupvoted", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

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

	Pouvconn.findOne({ sessionId, postId })
		.then(doc => {
			if(doc) {
				res.json({ upvoted: true });
			} else {
				res.json({ upvoted: false });
			}
		}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// ////////////////// Check whether a user has downvoted or not
router.post("/hasdownvoted", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

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

	Podvconn.findOne({ sessionId, postId })
		.then(doc => {
			if(doc) {
				res.json({ downvoted: true });
			} else {
				res.json({ downvoted: false });
			}
		}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// ////////////Get votes of a post
router.post("/getVotes", authenticate, (req, res) => {
	const { postId } = req.body;
	Post.findOne({ _id: postId })
		.then(post => {
			res.json({ success: true, upvotes_count: post.upvotes_count, downvotes_count: post.downvotes_count });
		}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// /////////////////////////// Comments

router.post("/insertComment", authenticate, (req, res) => {
	const { postId, commenttext } = req.body;
	const { sessionId } = req.currentUser;
	let newcomment = new Comment({ text: commenttext, postId });
		
	newcomment.save()
		.then(Comment => {
			Post.findOneAndUpdate(
				{ _id: postId },
				{ $inc: { comments_count: 1 } }
			).then(() => {
				if(Comment) {
					let comment = {};
					comment.upvotes_count = Comment.upvotes_count;
					comment.downvotes_count = Comment.downvotes_count;
					comment.postId = Comment.postId;
					comment.posted = Comment.posted;
					comment.text = Comment.text;
					comment._id = Comment._id;
					comment.hasupvoted = Comment.hasupvoted;
					comment.hasdownvoted = Comment.hasdownvoted;

					const errors = [];
					const action = "comment";
					const newactivity = new Activity({ action, postId, user: sessionId });
					newactivity.save()
						.then(() => {
							User.findOneAndUpdate(
								{ sessionId },
								{ $inc: {comments_given: 1} }	// eslint-disable-line
							).catch(err => errors.push(err.message));
						}).catch(err => {
							errors.push(err.message);
						});

					res.json({ comment });
				} else {	
					errors.push("Something went wrong");
				}
			}).catch(err => errors.push(err.message));
		})
		.catch(err => res.status(400).json({ errors: { global: err } }));
});

// Get all comments
router.post("/allComments/:per/:page", authenticate, (req, res) => {
	const { postId } = req.body;
	const { sessionId } = req.currentUser;

	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	const query = { postId };
	const options = {
		select: '-upvotes -downvotes',
		sort: { posted: -1 },
		lean: true,
		limit,
		page: pageNo
	}

	const errors = [];
	Comment.paginate(query, options)
		.then(comments => {
			res.json({ comments });
		}).catch(err => {
			errors.push(err.message);
			res.status(400).json({ errors: { global: err } })
		});
});

// Get comments count
router.post("/getCommentsCount", authenticate, (req, res) => {
	const { postId } = req.body;
	Post.findOne({ _id: postId }, 'comments_count')
		.then(comments_count => {
			res.json({ comments_count });
		})
		.catch(err => res.status(400).json({ errors: { global: err } }));
});

// ----------------------------------------------------------------------------
// Reports

router.post("/insertReport", authenticate, (req, res) => {
	const { postId, reason } = req.body;
	const { sessionId } = req.currentUser;

	let newreport = new Report({
		author: sessionId,
		postId,
		reason
	});
	newreport.save().then(report => {
		const errors = [];
		const action = "report";
		const newactivity = new Activity({ action, postId, user: sessionId });
		newactivity.save()
			.catch(err => errors.push(err.message));

		Post.findOneAndUpdate(
				{ _id: postId },
				{ $push: {reports: {id: report._id, category: reason}}, $inc: { reports_count: 1 } }
			).then(Post => {
				if(Post) {
					res.json({ success: true });
				} else {
					errors.push("Something went wrong");
				}
			}).catch(err => errors.push(err.message));
	}).catch(err => {
		errors.push(err.message);
		res.status(400).json({ errors: { global: err } })
	});
});

router.post("/fetchReportedPosts/:per/:page", (req, res) => {
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	
	const limit = size;
	let query = {};
	
	const options = {
		// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
		select: '-upvotes -downvotes -comments',
		sort: { reports_count: -1 },
		lean: true,
		page: pageNo,
		limit
	}

	Post.paginate(query, options)
		.then(posts => {
		res.json({ posts });
	}).catch(err => res.status(400).json({ err: { global: err } }));	
});

router.post("/fetchReportedPostsByFilter/:per/:page", (req, res) => {
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const { category } = req.body;
	
	const limit = size;
	let query = { "reports.category": category };
	
	const options = {
		// select: '_id cardColor isCardStyle title type hashtags category comments_count downvotes_count upvotes_count location_city location_state location_country text images videos',
		select: '-upvotes -downvotes -comments',
		sort: { reports_count: -1 },
		lean: true,
		page: pageNo,
		limit
	}

	Post.paginate(query, options).then(posts => {
		res.json({ posts });
	}).catch(err => res.status(400).json({ err: { global: err } }));	
});

// Delete post
router.post("/deletePost", (req, res) => {
	const { id } = req.body;
	Post.findOne({ _id: id })
		.deleteOne(() => {
			res.json({ success: true });
		}).catch(err => {
			res.status(400).json({ success: false });
		})
});

export default router;