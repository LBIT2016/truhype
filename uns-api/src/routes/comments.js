import express from "express";
import Comment from "../models/Comment";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

// Get upvotes and downvotes of comment
router.post("/getCommentVotes", authenticate, (req, res) => {
	const { commId } = req.body;

	Comment.findOne({ _id: commId })
		.then(comment => {
			res.json({ 
				success: true, 
				upvotes_count: comment.upvotes_count, 
				downvotes_count: comment.downvotes_count 
			});
		}).catch(err => {
			res.status(400).json({ errors: { global: err } });
		});
});

// hasupvoted
router.post("/hasupvoted", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { commId } = req.body;

	Comment.findOne(
		{ _id: commId },
		{
			upvotes_count: 1,
			upvotes: {
				"$elemMatch": { "$eq": sessionId }
			}
		}
	).then(comment => {	
		if(comment.upvotes.length > 0) {
			res.json({ upvoted: true })
		} else {
			res.json({ upvoted: false })
		}
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

router.post("/hasdownvoted", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { commId } = req.body;

	Comment.findOne(
		{ _id: commId },
		{
			upvotes_count: 1,
			downvotes: {
				"$elemMatch": { "$eq": sessionId }
			}
		}
	).then(comment => {
		if(comment.downvotes.length > 0) {
			res.json({ downvoted: true })
		} else {
			res.json({ downvoted: false })
		}
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// //////////////////////// Upvoting

// Upvoting a post
router.post("/upvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { commId } = req.body;

	Comment.updateOne(
		{ _id: commId, upvotes: { "$ne": sessionId }},	// Search for the requested post not has user id (i.e, user has not upvoted earlier)
		{ "$inc": { upvotes_count: 1 }, "$push": { "upvotes": sessionId } }	// If not has, increment upvote and push the user id into upvotes array.
	).then(() => {
		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// Removing Upvote for a comment
router.post("/removeupvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { commId } = req.body;

	Comment.updateOne(
		{ _id: commId, upvotes: sessionId },	// Search for the requested comment has user id (i.e, user has upvoted earlier)
		{ "$inc": { upvotes_count: -1 }, "$pull": { "upvotes": sessionId } }	// If not has, increment upvote and push the user id into upvotes array.
	).then(() => {
		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// //////////////////////////// downvoting

// Downvoting a comment
router.post("/downvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { commId } = req.body;

	Comment.updateOne(
		{ _id: commId, downvotes: { "$ne": sessionId }},	// Search for the requested comment not has user id (i.e, user has not upvoted earlier)
		{ "$inc": { downvotes_count: 1 }, "$push": { "downvotes": sessionId } }	// If not has, increment upvote and push the user id into downvotes array.
	).then(() => {
		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

// Removing Upvote for a comment
router.post("/removedownvote", authenticate, (req, res) => {
	const { sessionId } = req.currentUser;
	const { commId } = req.body;

	Comment.updateOne(
		{ _id: commId, downvotes: sessionId },	// Search for the requested comment has user id (i.e, user has upvoted earlier)
		{ "$inc": { downvotes_count: -1 }, "$pull": { "downvotes": sessionId } }	// If not has, increment upvote and push the user id into downvotes array.
	).then(() => {
		res.json({ success: true });
	}).catch(err => res.status(400).json({ errors: { global: err } }));
});

export default router;