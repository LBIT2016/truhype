import express from "express";
import User from "../models/User";
import Admin from "../models/Admin";
import Post from "../models/Post";
import Activity from "../models/Activity";
import Uspsconn from "../models/Uspsconn";

// import parseErrors from "../utils/parseErrors";
import sessionIdGen from "../utils/sessionIdGen";
import keyGen from "../utils/keyGen";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hey I am working too.");
});

router.post("/", (req, res) => {
	const sessionId = sessionIdGen();
	const key = keyGen();
	const user = new User({ sessionId, key });
	user.save()
		.then(userRecord => {
			Admin.updateOne(
				{ name: "Admin" }, 
				{ $inc: { sessions_count: 1 } }
			)
			.then(() => {
				res.json({ user: userRecord.toAuthJSON() });
			});
		})
		.catch(err => {
			res.status(400).json({ errors: err });
		});
});

router.post("/checkDetails", (req, res) => {
	const { sessionId } = req.body;
	User.findOne({ sessionId }).
		then(user => {
			if(user.username) {
				res.json({ success: true });
			} else {
				res.json({ success: false });
			}
		}).catch(err => {
			res.status(400).json({ err });
		})
});

// Login function
router.post("/login", (req, res) => {
	const { credentials } = req.body;
	User.findOne({ username: credentials.username, key: credentials.password }).then(user => {
		if (user) {
			res.json({ user: user.toAuthJSON() });
		} else {
			res.status(400).json({ errors: { global: "Invalid credentials" } });
		}
	});
});

// set user's location and username
router.post("/setUserData", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { country, state, city, username } = req.body.data;
	User.findOneAndUpdate(
		{ sessionId },
		{
			location_country: country,
			location_state: state,
			location_city: city,
			username
		}
	).then(userRecord => 
		userRecord ? 
			res.json({ user: userRecord.toAuthJSON() }) 
		: 
			res.status(400).json({})
	);
});

// return location
router.post("/getlocation", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	User.findOne({ sessionId })
		.then(userRecord => 
			userRecord ? 
			res.json({ 
				user: { 
					...userRecord.toAuthJSON(), 
					location_city: userRecord.location_city,
					location_state: userRecord.location_state,
					location_country: userRecord.location_country
				} 
			}) : 
			res.status(400).json({ err: { global: "User location not found!" } }));
});

// return username
router.post("/getusername", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	User.findOne({ sessionId })
		.then(userRecord => 
			userRecord ?
				res.json({ username: userRecord.username })
			:
			res.status(400).json({ err: { global: "User location not found!" } })
		)
		.catch(err => res.status(400).json({ err: { global: err } }));
});

// return key
router.post("/getkey", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	User.findOne({ sessionId })
		.then(userRecord =>
			userRecord ?
				res.json({ key: userRecord.getEncrypKey() })
			:
			res.status(400).json({ err: { global: "User key not found!" } })
		)
		.catch(err => res.status(400).json({ err: { global: err } }));
});


// Regenrate key
router.post("/regenKey", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const key = keyGen();
	User.findOneAndUpdate(
		{sessionId},
		{key}
	).then(userRecord => 
		userRecord ?
			res.json({ key: userRecord.getEncrypKey() })
		:
		res.status(400).json({ err: { global: "User key not found!" } })
	)
	.catch(err => res.status(400).json({ err: { global: err } }));
});

// return user's posts
router.post("/getPosts/:per/:page", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;

	const query = {
		author: sessionId
	}

	const options = {
		select: '_id title text images videos type isCardStyle cardColor',
		sort: { dateCreated: -1 },
		lean: true,
		page: pageNo,
		limit
	}
	
	Post.paginate(query, options).then(posts => {
		res.json({ posts });
	}).catch(err => res.status(400).json({ err: { global: err } }));
});

// delete all user's posts
router.post("/deletePosts", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;

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

	const errors = [];
	Uspsconn.find({ sessionId })
		.remove(() => {
			Post.find({ author: sessionId })
				.remove(() => res.json({ success: true }))
				.catch(err => {
					errors.push(err);
				})
		}).catch(err => {
			errors.push(err)
			res.status(400).json({ errors });
		});
});

// return user's activity
router.post("/getActivity/:per/:page", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const pageNo = parseInt(req.params.page, 10);
	const size = parseInt(req.params.per, 10);
	const limit = size;

	const query = {
		user: sessionId
	}

	const options = {
		select: 'action postId',
		sort: { dateCreated: -1 },
		lean: true,
		page: pageNo,
		limit
	}
	
	Activity.paginate(query, options).then(activity => {
		res.json({ activity });
	}).catch(err => res.status(400).json({ err: { global: err } }));
});

// return user's upvotes_given, downvotes_given and comments_given
router.post("/getAnalytics", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	User.findOne({ sessionId })
		.then(user => {
			res.json({ 
				analytics: {
					upvotes_given: user.upvotes_given,
					downvotes_given: user.downvotes_given,
					posts_seen: user.posts_seen
				}
			})
		}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// update posts Seen
router.post("/updatePostsSeen", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { postId } = req.body;

	if(postId && postId !== "" && postId !== null) {
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
		const errors = [];
		Uspsconn.findOne({ sessionId, postId })
			.then(doc => {
				if(doc) {
					res.json({});
				} else {
					const newdoc = new Uspsconn({ sessionId, postId });
					newdoc.save()
						.then(() => {
							User.findOneAndUpdate(
								{ sessionId },
								{ $inc: { posts_seen: 1 } }
							).then(user => {
								res.json({ 
									analytics: {
										upvotes_given: user.upvotes_given,
										downvotes_given: user.downvotes_given,
										posts_seen: user.posts_seen
									}
								});
							}).catch(err => errors.push(err));
						}).catch(err => errors.push(err));
				}
			}).catch(err => {
				errors.push(err)
				res.status(400).json({ errors });
			});
	}else {
		res.json({});
	}
});

export default router;