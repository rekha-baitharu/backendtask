var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var jwt = require("jsonwebtoken");
var app = express();
var bodyParser = require("body-parser");
var userrouter = require("./routes/user_router.js");

app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), function () {
    console.log("app is running on port " + app.get("port"))
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoClient.connect("mongodb://localhost:27017/task", function (err, database) {
    userrouter.configure(app, database);
    app.get("/", function (req, res) {
        res.send("welcome to the page");
    })
});