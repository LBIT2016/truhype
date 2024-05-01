"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _shortid = require("shortid");

var _shortid2 = _interopRequireDefault(_shortid);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _users = require("./routes/users");

var _users2 = _interopRequireDefault(_users);

var _locations = require("./routes/locations");

var _locations2 = _interopRequireDefault(_locations);

var _images = require("./routes/images");

var _images2 = _interopRequireDefault(_images);

var _videos = require("./routes/videos");

var _videos2 = _interopRequireDefault(_videos);

var _posts = require("./routes/posts");

var _posts2 = _interopRequireDefault(_posts);

var _admins = require("./routes/admins");

var _admins2 = _interopRequireDefault(_admins);

var _hashtags = require("./routes/hashtags");

var _hashtags2 = _interopRequireDefault(_hashtags);

var _categories = require("./routes/categories");

var _categories2 = _interopRequireDefault(_categories);

var _feedbacks = require("./routes/feedbacks");

var _feedbacks2 = _interopRequireDefault(_feedbacks);

var _surveyresponses = require("./routes/surveyresponses");

var _surveyresponses2 = _interopRequireDefault(_surveyresponses);

var _comments = require("./routes/comments");

var _comments2 = _interopRequireDefault(_comments);

var _reports = require("./routes/reports");

var _reports2 = _interopRequireDefault(_reports);

var _adposts = require("./routes/adposts");

var _adposts2 = _interopRequireDefault(_adposts);

var _adStatistics = require("./routes/adStatistics");

var _adStatistics2 = _interopRequireDefault(_adStatistics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configurations and settings


// local files
_dotenv2.default.config();
var app = (0, _express2.default)();
app.use(_bodyParser2.default.json());
app.use(_express2.default.static(_path2.default.join(__dirname, "../../../uns-react/build")));
_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-$');

// routes
app.use("/api/users", _users2.default);
app.use("/api/locations", _locations2.default);
app.use("/api/images", _images2.default);
app.use("/api/videos", _videos2.default);
app.use("/api/posts", _posts2.default);
app.use("/api/admins", _admins2.default);
app.use("/api/hashtags", _hashtags2.default);
app.use("/api/categories", _categories2.default);
app.use("/api/feedbacks", _feedbacks2.default);
app.use("/api/surveyresponses", _surveyresponses2.default);
app.use("/api/comments", _comments2.default);
app.use("/api/reports", _reports2.default);
app.use("/api/adposts", _adposts2.default);
app.use("/api/adStatistics", _adStatistics2.default);

// redirecting all other routes to client
app.get("/*", function (req, res) {
	res.sendFile(_path2.default.join(__dirname, '../../../uns-react/build/index.html'));
});

// Server listening
app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), function () {
	console.log("API listening on " + app.get("port")); //eslint-disable-line
});