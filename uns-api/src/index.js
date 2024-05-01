import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import shortid from "shortid";
import path from "path";

// local files
import users from "./routes/users";
import locations from "./routes/locations";
import images from "./routes/images";
import videos from "./routes/videos";
import posts from "./routes/posts";
import admins from "./routes/admins";
import hashtags from "./routes/hashtags";
import categories from "./routes/categories";
import feedbacks from "./routes/feedbacks";
import surveyresponses from "./routes/surveyresponses";
import comments from "./routes/comments";
import reports from "./routes/reports";
import adposts from "./routes/adposts";
import adStatistics from "./routes/adStatistics";

// configurations and settings
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../../../uns-react/build")));
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-$');

// routes
app.use("/api/users", users);
app.use("/api/locations", locations);
app.use("/api/images", images);
app.use("/api/videos", videos);
app.use("/api/posts", posts);
app.use("/api/admins", admins);
app.use("/api/hashtags", hashtags);
app.use("/api/categories", categories);
app.use("/api/feedbacks", feedbacks);
app.use("/api/surveyresponses", surveyresponses);
app.use("/api/comments", comments);
app.use("/api/reports", reports);
app.use("/api/adposts", adposts);
app.use("/api/adStatistics", adStatistics);

// redirecting all other routes to client
app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, '../../../uns-react/build/index.html'));
});

// Server listening
app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), () => {
	console.log(`API listening on ${app.get("port")}`); //eslint-disable-line
});