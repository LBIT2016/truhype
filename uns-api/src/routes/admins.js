import express from "express";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin";

const router = express.Router();


router.get("/", (req, res) => {
	res.send("Admin router is working  successfully...");
});

router.get("/create", (req, res) => {
	const admin = new Admin({ 
		name: "Admin", 
		username: "Admin", 
		passwordHash: "$2b$10$7Hc4slzd88LuHch1QakwFu0POtfpcXGecjRvK1JRBgk1zK0RrKt.2",
		masterKeyHash: "$2b$10$8/WWuAKLVgkTjjm1GCfbhufT5AcxSRzApRsTcPm3a3QVIQE4CHDaW"
	});
	admin.save().then(ad => {
		res.json({ ad });
	})
}); 

/* router.get("/update", (req, res) => {
	Admin.findOneAndUpdate(
		{username: "Admin"},
		{ passwordHash: "$2b$10$fNfxGmNf7lLYBmXG5scIEeve8F5EI21ryPDgFJ6bpW32u7wV4ShNK" }
	).then(admin => {
		res.json({ admin });
	}).catch(err => res.status(400).json({ errors: err }));
}) */

router.post("/login", (req, res) => {
	const { credentials } = req.body;
	Admin.findOne({ username: credentials.username }).then(admin => {
		if (admin && admin.isValidPassword(credentials.password)) {
			res.json({ admin: admin.toAuthJSON() });
		} else {
			res.status(400).json({ errors: { global: "Invalid credentials" } });
		}
	});
});

router.post("/change_password", (req, res) => {
	const { password, token, masterKey } = req.body.data;
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if(err) {
			res.status(401).json({ errors: { global: "Invalid token!" }});
		} else{
			Admin.findOne({ _id: decoded._id }).then(admin => {		// eslint-disable-line
				if(admin) {
					if(admin.isValidMasterKey(masterKey)) {
						admin.setPassword(password);
						admin.save().then(() => 
							res.json({ admin: admin.toAuthJSON() })
						);	
					} else {
						res.status(404).json({ errors: { global: "Invalid masterKey" }});		
					}
				} else {
					res.status(404).json({ errors: { global: "Invalid token" }});
				}
			});
		}
	});
});

export default router; 