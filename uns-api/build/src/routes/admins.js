"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _Admin = require("../models/Admin");

var _Admin2 = _interopRequireDefault(_Admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get("/", function (req, res) {
	res.send("Admin router is working  successfully...");
});

router.get("/create", function (req, res) {
	var admin = new _Admin2.default({
		name: "Admin",
		username: "Admin",
		passwordHash: "$2b$10$7Hc4slzd88LuHch1QakwFu0POtfpcXGecjRvK1JRBgk1zK0RrKt.2",
		masterKeyHash: "$2b$10$8/WWuAKLVgkTjjm1GCfbhufT5AcxSRzApRsTcPm3a3QVIQE4CHDaW"
	});
	admin.save().then(function (ad) {
		res.json({ ad: ad });
	});
});

/* router.get("/update", (req, res) => {
	Admin.findOneAndUpdate(
		{username: "Admin"},
		{ passwordHash: "$2b$10$fNfxGmNf7lLYBmXG5scIEeve8F5EI21ryPDgFJ6bpW32u7wV4ShNK" }
	).then(admin => {
		res.json({ admin });
	}).catch(err => res.status(400).json({ errors: err }));
}) */

router.post("/login", function (req, res) {
	var credentials = req.body.credentials;

	_Admin2.default.findOne({ username: credentials.username }).then(function (admin) {
		if (admin && admin.isValidPassword(credentials.password)) {
			res.json({ admin: admin.toAuthJSON() });
		} else {
			res.status(400).json({ errors: { global: "Invalid credentials" } });
		}
	});
});

router.post("/change_password", function (req, res) {
	var _req$body$data = req.body.data,
	    password = _req$body$data.password,
	    token = _req$body$data.token,
	    masterKey = _req$body$data.masterKey;

	_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
		if (err) {
			res.status(401).json({ errors: { global: "Invalid token!" } });
		} else {
			_Admin2.default.findOne({ _id: decoded._id }).then(function (admin) {
				// eslint-disable-line
				if (admin) {
					if (admin.isValidMasterKey(masterKey)) {
						admin.setPassword(password);
						admin.save().then(function () {
							return res.json({ admin: admin.toAuthJSON() });
						});
					} else {
						res.status(404).json({ errors: { global: "Invalid masterKey" } });
					}
				} else {
					res.status(404).json({ errors: { global: "Invalid token" } });
				}
			});
		}
	});
});

exports.default = router;