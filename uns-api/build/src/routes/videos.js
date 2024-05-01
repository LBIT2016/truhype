"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _gridfsStream = require("gridfs-stream");

var _gridfsStream2 = _interopRequireDefault(_gridfsStream);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var router = _express2.default.Router();

var conn = _mongoose2.default.connection;
var gfs = void 0;

conn.once('open', function () {
   gfs = (0, _gridfsStream2.default)(conn.db, _mongoose2.default.mongo);
});

/** Seting up server to accept cross-origin browser requests */
router.use(function (req, res, next) {
   // allow cross origin requests
   var allowedOrigins = ["http://localhost:3000", "https://truhype.app"];
   var origin = req.headers.origin;
   if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
   }
   res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
   // res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Credentials", true);
   next();
});

// set up connection to db for file storage
var storage = require('multer-gridfs-storage')({
   url: process.env.MONGODB_URL,
   file: function file(req, _file) {
      // eslint-disable-line
      return {
         filename: Date.now() + _file.originalname
      };
   }
});

var singleUpload = (0, _multer2.default)({ storage: storage }).single('file');
var multipleUpload = (0, _multer2.default)({ storage: storage }).array('files', 8);

router.get('/files/:filename', function (req, res) {
   gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
      if (!files || files.length === 0) {
         return res.status(404).json({
            message: "Could not find file"
         });
      }

      var readstream = void 0;

      if (req.headers['range']) {
         // eslint-disable-line
         var parts = req.headers['range'].replace(/bytes=/, "").split("-"); // eslint-disable-line
         var partialstart = parts[0];
         var partialend = parts[1];

         var start = parseInt(partialstart, 10);
         var end = partialend ? parseInt(partialend, 10) : files[0].length - 1;
         var chunksize = end - start + 1;

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

router.get('/files', function (req, res) {
   gfs.files.find().toArray(function (err, files) {
      if (!files || files.length === 0) {
         return res.status(404).json({
            message: "Could not find files"
         });
      }
      return res.json(files);
   });
});

router.post('/files', singleUpload, function (req, res) {
   if (req.file) {
      return res.json({
         success: true,
         file: req.file
      });
   }
   res.send({ success: false });
   return null;
});

router.post('/multifiles', multipleUpload, function (req, res) {
   if (req.files) {
      return res.json({
         success: true,
         files: req.files
      });
   }
   res.send({ success: false });
   return null;
});

router.delete('/files/:id', function (req, res) {
   gfs.remove({ _id: req.params.id }, function (err) {
      if (err) return res.status(500).json({ success: false });
      return res.json({ success: true });
   });
});

module.exports = router;