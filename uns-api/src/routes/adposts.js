import express from "express";
import Hashtag from "../models/Hashtag";
import AdPost from "../models/AdPost";
import Admin from "../models/Admin";
import Activity from "../models/Activity";
import Comment from "../models/Comment";
import Report from "../models/Report";

import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.post("/insert", (req, res) => {
	const { type } = req.body.adpost;
	
	/* eslint-disable */
	if(type === 'text') {
		let { 
			locations,
			locationtype,
			isNotification, 
			title, 
			text, 
			category, 
			hashtags, 
			isCardStyle, 
			cardColor 
		} = req.body.adpost;		
		const errors = [];

		if(hashtags.length > 0) {
			hashtags.map(hashtag => {
				Hashtag.findOneAndUpdate(
					{ hashtag },
					{ $inc: { count: 1 } },
					{ upsert: true, new: true, setDefaultsOnInsert: true }
				).catch(err => errors.push(err));
				return null;
			})
		}
		const textpost = new AdPost({
			type,
			locationtype,
			locations,
			isNotification,
			title,
			text,
			category,
			hashtags,
			isCardStyle,
			cardColor
		});
		textpost.save()
				.then(textpostRecord => {
					let adpost = {};
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

					Admin.findOneAndUpdate(
						{ name: "Admin" },
						{ $push: { posts: textpostRecord._id } }
					).catch(err => errors.push(err));

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
				})
				.catch(err => {
					errors.push(err);
					res.status(400).json({ errors:err });
				});
	} else if(type === 'image') {
		let { 
			locations,
			locationtype,
			isNotification,
			title, 
			images, 
			category, 
			hashtags 
		} = req.body.adpost;	//eslint-disable-line
		const errors = [];
		if(hashtags.length > 0) {
			hashtags.map(hashtag => {
				Hashtag.findOneAndUpdate(
					{ hashtag },
					{ $inc: { count: 1 } },
					{ upsert: true, new: true, setDefaultsOnInsert: true }
				).catch(err => errors.push(err));
				return null;
			})
		}
		const imagepost = new AdPost({
			type,
			isNotification,
			locations,
			locationtype,
			title,
			images,
			category,
			hashtags
		});
		imagepost.save()
				.then(imagepostRecord => {
					let adpost = {};
					adpost._id = imagepostRecord._id;
					adpost.category = imagepostRecord.category;
					adpost.comments_count = imagepostRecord.comments_count;
					adpost.downvotes_count = imagepostRecord.downvotes_count;
					adpost.upvotes_count = imagepostRecord.upvotes_count;
					adpost.hashtags = imagepostRecord.hashtags;
					adpost.images = imagepostRecord.images;
					adpost.title = imagepostRecord.title;
					adpost.type = imagepostRecord.type;

					Admin.findOneAndUpdate(
						{ name: "Admin" },
						{ $push: { posts: imagepostRecord._id } }
					).catch(err => errors.push(err));

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
				})
				.catch(err => {
					errors.push(err);
					res.status(400).json({ errors });
				});
	} else if(type === 'video') {
		let { 
			locations,
			locationtype,
			isNotification,
			title, 
			videos, 
			category, 
			hashtags 
		} = req.body.adpost;	// eslint-disable-line
		const errors = [];
		if(hashtags.length > 0) {
			hashtags.map(hashtag => {
				Hashtag.findOneAndUpdate(
					{ hashtag },
					{ $inc: { count: 1 } },
					{ upsert: true, new: true, setDefaultsOnInsert: true }
				).catch(err => errors.push(err));
				return null;
			})
		}
		const videopost = new AdPost({
			type,
			isNotification,
			locationtype,
			locations,
			title,
			videos,
			category,
			hashtags
		});
		videopost.save()
				.then(videopostRecord => {
					let adpost = {};
					adpost._id = videopostRecord._id;
					adpost.category = videopostRecord.category;
					adpost.comments_count = videopostRecord.comments_count;
					adpost.downvotes_count = videopostRecord.downvotes_count;
					adpost.upvotes_count = videopostRecord.upvotes_count;
					adpost.hashtags = videopostRecord.hashtags;
					adpost.videos = videopostRecord.videos;
					adpost.title = videopostRecord.title;
					adpost.type = videopostRecord.type;

					Admin.findOneAndUpdate(
						{ name: "Admin" },
						{ $push: { posts: videopostRecord._id } }
					).catch(err => errors.push(err));

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
				})
				.catch(err => {
					errors.push(err);
					res.status(400).json({ errors });
				});
	} else {
		res.send(400).json({ err: { global: "Something went wrong at the front end at type."} });
	}
});

router.post("/fetchAdPosts/:per/:page", authenticate, (req, res) => {
	const { location_country, location_state, location_city } = req.currentUser;
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	let query = {};
	
	const options = {
		select: '-locations -locationtype -isNotification -dateCreated -upvotes -downvotes -comments -reports -reports_count',
		sort: { upvotes_count: -1 },
		lean: true,
		page: pageNo,
		limit
	}

	AdPost.paginate(query, options).then(posts => {
		res.json({ posts });
	}).catch(err => res.status(400).json({ err: { global: err } }));
});

router.post("/fetchAdPostsForAdmin/:per/:page", (req, res) => {
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	let query = {};
	
	const options = {
		select: '-upvotes -downvotes',
		sort: { dateCreated: -1 },
		lean: true,
		page: pageNo,
		limit
	}

	AdPost.paginate(query, options).then(posts => {
		res.json({ posts });
	}).catch(err => res.status(400).json({ err: { global: err } }));
});

router.post("/findbyid", (req, res) => {
	const { id } = req.body;

	AdPost.findOne({ _id: id })
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

// //////////////////////// Upvoting

// Upvoting a post
router.post("/upvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;
	const errors = [];

	AdPost.updateOne(
		{ _id: postId, upvotes: { "$ne": sessionId }},	// Search for the requested post not has user id (i.e, user has not upvoted earlier)
		{ "$inc": { upvotes_count: 1 }, "$push": { "upvotes": sessionId } }	// If not has, increment upvote and push the user id into upvotes array.
	).then(() => {
		const action = "upvote";
		const newactivity = new Activity({ action, postId, user: sessionId });
		newactivity.save()
			.then(activity => {
				User.findOneAndUpdate(
					{ sessionId },
					{ $push: { activity: activity._id } }	// eslint-disable-line
				).catch(err => errors.push(err));
			}).catch(err => {
				errors.push(err);
			});

		res.json({ success: true });
	}).catch(err => {
		errors.push(err);
		res.status(400).json({ errors: { global: errors } })
	});
});

// Removing Upvote for a post
router.post("/removeupvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

	AdPost.updateOne(
		{ _id: postId, upvotes: sessionId },	// Search for the requested post has user id (i.e, user has upvoted earlier)
		{ "$inc": { upvotes_count: -1 }, "$pull": { "upvotes": sessionId } }	// If not has, increment upvote and push the user id into upvotes array.
	).then(() => {
		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// //////////////////////////// downvoting

// Downvoting a post
router.post("/downvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

	const errors = [];
	AdPost.updateOne(
		{ _id: postId, downvotes: { "$ne": sessionId }},	// Search for the requested post not has user id (i.e, user has not upvoted earlier)
		{ "$inc": { downvotes_count: 1 }, "$push": { "downvotes": sessionId } }	// If not has, increment upvote and push the user id into downvotes array.
	).then(() => {
		const action = "downvote";
		const newactivity = new Activity({ action, postId, user: sessionId });
		newactivity.save()
			.then(activity => {
				User.findOneAndUpdate(
					{ sessionId },
					{ $push: { activity: activity._id } }	// eslint-disable-line
				).catch(err => errors.push(err));
			}).catch(err => {
				errors.push(err);
			});

		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// Removing Upvote for a post
router.post("/removedownvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

	AdPost.updateOne(
		{ _id: postId, downvotes: sessionId },	// Search for the requested post has user id (i.e, user has upvoted earlier)
		{ "$inc": { downvotes_count: -1 }, "$pull": { "downvotes": sessionId } }	// If not has, increment upvote and push the user id into downvotes array.
	).then(() => {
		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// ////////////////// Check whether a user has upvoted or not
router.post("/hasupvoted", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

	AdPost.findOne(
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
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// ////////////////// Check whether a user has downvoted or not
router.post("/hasdownvoted", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

	AdPost.findOne(
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
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// ////////////Get votes of a post
router.post("/getVotes", authenticate, (req, res) => {
	const { postId } = req.body;
	AdPost.findOne({ _id: postId })
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
			AdPost.findOneAndUpdate(
				{ _id: postId },
				{ $push: {comments: Comment._id}, $inc: { comments_count: 1 } },
				{ fields: "comments" }
			).then(() => {
				if(Comment) {
					let comment = {};
					comment.upvotes_count = Comment.upvotes_count;
					comment.downvotes_count = Comment.downvotes_count;
					comment.postId = Comment.postId;
					comment.posted = Comment.posted;
					comment.text = Comment.text;
					comment._id = Comment._id;

					const errors = [];
					const action = "comment";
					const newactivity = new Activity({ action, postId, user: sessionId });
					newactivity.save()
						.then(activity => {
							User.findOneAndUpdate(
								{ sessionId },
								{ $push: { activity: activity._id } }	// eslint-disable-line
							).catch(err => errors.push(err));
						}).catch(err => {
							errors.push(err);
						});

					res.json({ comment });
				} else {
					// res.status(400).json({ errors: { global: "Something went wrong" } });	
					errors.push("Something went wrong");
				}
			}).catch(err => res.status(400).json({ errors: { global: err } }));
		})
		.catch(err => res.status(400).json({ errors: { global: err } }));
});

// Get all comments
router.post("/allComments/:per/:page", authenticate, (req, res) => {
	const { postId } = req.body;

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

	/* AdPost.findOne({ _id: postId }, 'comments' )
		.populate('comments')
		// .sort({ posted: -1 })
		.exec((err, comments) => {
			if(err) {
				return res.status(400).json({ errors: { global: err } });
			}

			res.json({ comments: comments.comments });
		}); */
	Comment.paginate(query, options)
		.then(comments => {
			res.json({ comments });
		}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// Get comments count
router.post("/getCommentsCount", authenticate, (req, res) => {
	const { postId } = req.body;
	AdPost.findOne({ _id: postId }, 'comments_count')
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
			.then(activity => {
				User.findOneAndUpdate(
					{ sessionId },
					{ $push: { activity: activity._id } }	// eslint-disable-line
				).catch(err => errors.push(err));
			}).catch(err => errors.push(err));

		AdPost.findOneAndUpdate(
				{ _id: postId },
				{ $push: {reports: report._id}, $inc: { reports_count: 1 } }
			).then(Post => {
				if(Post) {
					res.json({ success: true });
				} else {
					errors.push("Something went wrong");
				}
			}).catch(err => errors.push(err));
	}).catch(err => {
		errors.push(err);
		res.status(400).json({ errors: { global: err } })
	});
});

router.get("/check/:per/:page/:city/:state/:country", (req, res) => {
	
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	const city = req.params.city;
	const state = req.params.state;
	const country = req.params.country;
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
	let query = {};

	const options = {
		limit: 10,
		page: pageNo
	}

	AdPost.aggregatePaginate(query, options).then(docs => {
		res.json(docs);
	}).catch(err => {
		res.status(400).json({ errors: err });
	})
});

router.get("/check2/:per/:page/:city/:state/:country", (req, res) => {
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;
	const city = req.params.city;
	const state = req.params.state;
	const country = req.params.country;
	let query = {};

	const options = {
		limit,
		page: pageNo,
		lean: true
	}

	const result = [];
	async function filter(docs) {
		
	}

	AdPost.paginate(query, options).then(docs => {
		if(docs) {
			const resultPromise = [];
			resultPromise.push(
				new Promise((resolve, reject) => {
					for (var i = docs.length - 1; i >= 0; i--) {
						console.log(docs[i]);
						if(docs[i].locationtype == "all") {
							resolve(docs[i]);
						} else if(docs[i].locationtype == "locationstoshow") {
							for ( var j = docs[i].locations.length - 1;  j >= 0 ; j--) {
								if(docs[j].locations[j].city && docs[j].locations[j].city==city) {
									resolve(docs[i]);
									break;
								} else if(docs[j].locations[j].state && docs[j].locations[j].state==state) {
									resolve(docs[i]);
									break;
								} else if(docs[j].locations[j].country && docs[j].locations[j].country==country) {
									resolve(docs[i]);
									break;
								}
							}
						}
					}
				})
			);

			Promise.all(resultPromise).then(([result]) => {
				console.log(result);
				res.json({ d: { docs: result, totalPages: docs.totalPages } });
			});
		}
		
	}).catch(err => res.status(400).json({ err }));
});

// Delete post
router.post("/deleteAdPost", (req, res) => {
	const { id } = req.body;
	AdPost.findOne({ _id: id })
		.deleteOne(() => {
			res.json({ success: true });
		}).catch(err => {
			res.status(400).json({ success: false });
		})
});

export default router;