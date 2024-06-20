import express from "express";
import multer from "multer";
import Grid from "gridfs-stream";
import dotenv from "dotenv";

import mongoose from "../mongoose";

dotenv.config();
const router = express.Router();

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
	gfs = Grid(conn.db, mongoose.mongo);
});

/** Seting up server to accept cross-origin browser requests */
router.use((req, res, next) => { // allow cross origin requests
  const allowedOrigins = ["http://localhost:3000","https://truhype.app"];
  const origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// set up connection to db for file storage
const storage = require('multer-gridfs-storage')({
   url: process.env.MONGODB_URL,
   file: (req, file) => {				// eslint-disable-line
      return {
         filename: Date.now() + file.originalname
      }
   }
});

const singleUpload = multer({ storage }).single('file');
const multipleUpload = multer({ storage }).array('files', 8);

router.get('/files/:filename', (req, res) => {
   gfs.files.find({ filename: req.params.filename }).toArray((err, files) => {
      if(!files || files.length === 0){
         return res.status(404).json({
            message: "Could not find file"
         });
      }

      let readstream;

      if (req.headers['range']) { // eslint-disable-line
            const parts = req.headers['range'].replace(/bytes=/, "").split("-"); // eslint-disable-line
            const partialstart = parts[0];
            const partialend = parts[1];

            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : files[0].length - 1;
            const chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + files[0].length, // eslint-disable-line
                'Content-Type': files[0].contentType
            });

            readstream = gfs.createReadStream({
                filename: files[0].filename,
                range: {
                    startPos: start,
                    endPos: end
                }
            });
        } else {
            res.header('Content-Length', files[0].length);
            res.header('Content-Type', files[0].contentType);

            readstream = gfs.createReadStream({
                filename: files[0].filename
            });
        }

      return readstream.pipe(res);
   });
});

router.get('/files', (req, res) => {
   gfs.files.find().toArray((err, files) => {
      if(!files || files.length === 0){
         return res.status(404).json({
            message: "Could not find files"
         });
      }
      return res.json(files);
   });
});

router.post('/files', singleUpload, (req, res) => {
   if (req.file) {
      return res.json({
         success: true,
         file: req.file
      });
   }
    res.send({ success: false });
    return null;
});

router.post('/multifiles', multipleUpload, (req, res) => {
	if(req.files) {
		return res.json({
			success: true,
			files: req.files
		})
	}
	res.send({ success: false });
	return null;
});

router.delete('/files/:id', (req, res) => {
   gfs.remove({ _id: req.params.id }, (err) => {
      if (err) return res.status(500).json({ success: false })
      return res.json({ success: true });
   })
})

module.exports = router;