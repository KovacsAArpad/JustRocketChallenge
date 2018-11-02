var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var fileUpload = require("express-fileupload");
var multer = require("multer");
const crypto = require("crypto");
let upload = multer({
  storage: multer.diskStorage({
    destination: __dirname + "/uploads/",
    filename: (req, file, cb) => {
      let customFileName = crypto.randomBytes(18).toString("hex"),
        fileExtension = file.originalname.split(".")[1]; // get file extension from original file name
      cb(null, customFileName + "." + fileExtension);
    }
  })
});

var app = express();

app.use(express.static(__dirname + "/web-app/build/"));

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: "true"
  })
);
app.use(methodOverride());

var files = [];

app.get("/", function(req, res) {
  res.sendFile("/web-app/build/index.html");
});

app.post("/auth", function(req, res) {
  if (req.body.username == "user" && req.body.password == "pass") {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.get("/files", function(req, res) {
  res.send({ files });
});

app.post("/files", upload.array("files", 10), function(req, res) {
  files = files.concat(req.files);
  res.sendStatus(200);
});

app.delete("/files", function(req, res) {
  var fileToDelete = files.find(function(file) {
    if (file.filename == this) {
      return file;
    }
  }, req.query.name);

  files.splice(files.indexOf(fileToDelete), 1);
  res.sendStatus(200);
});

app.get("/files/*", function(req, res) {
  var name = req.path.split("/")[2];

  res.sendFile(__dirname + "/uploads/" + name);
});

app.listen(8080);
console.log("listening on 8080");
