const user_modules = require("../modules/user_modules");

module.exports = {
    configure: function (app, database) {
        var ObjectID = require("mongodb").ObjectID;
        var jwt = require("jsonwebtoken");
        const bcrypt = require("bcrypt");
        var user_module = require("../modules/user_modules")(database);


        //1. JWT BASED AUTHENTICATION FOR LOGIN
        app.post("/jwt_login", async (req, res) => {
            try {
                var email = req.body.email;
                var password = req.body.password;
                var user = await database.db().collection("task").findOne({ email, password });
                jwt.sign({ user }, "user-token", { expiresIn: "30min" }, function (err, token) {
                    if (user) {
                        res.json({ status: true, message: "Login Successfull", result: email, token: token });
                    } else {
                        res.json({ status: false, message: "Invalid User Id And Password" });
                    }
                })
            } catch (err) {
                console.log(err);
                res.status(500).send("Something went wrong");
            }
        })

        app.post("/api", verifyToken, function (req, res) {
            jwt.verify(req.token, "user-token", function (err, authData) {
                if (err) {
                    res.json({ message: "error" });
                } else {
                    res.json({ message: "hello", authData });
                }
            })
        })

        // MIDDLEWARE
        function verifyToken(req, res, next) {
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(" ");
                const bearerToken = bearer[1];
                req.token = bearerToken;
                next();
            } else {
                res.json({ status: false, message: "error" })
            }
        }

        //1. JWT BASED AUTHENTICATION FOR SIGNUP
        app.post("/register", async (req, res) => {
            try {
                var email = req.body.email;
                var password = req.body.password;
                var user = {
                    email: email,
                    password: password
                }
                bcrypt.hash(password, 10).then((hash) => {
                    database.db().collection("task").insertOne(user, function (err, doc) {
                        res.json({ status: true, message: "User registered" });
                    })
                })
            } catch (err) {
                console.log(err);
                res.status(500).send("Something went wrong");
            }
        })

        //2.OPEN API FOR ALL USERS
        app.get("/", function (req, res) {
            res.json({
                status: true,
                message: "welcome to the page"
            });
        })

        //3.API FOR LOGIN USER
        app.get("/login", async (req, res) => {
            try {
                var email = req.query.email;
                var password = req.query.password;
                var user = await database.db().collection("task").findOne({ email, password });
                if (user) {
                    res.send("login successful");
                } else {
                    res.send("login failed")
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).send("Something went wrong");
            }
        })

        //OR
        app.post("/login2", async (req, res) => {
            try {
                var email = req.body.email;
                var password = req.body.password;
                var user = await database.db().collection("task").findOne({ email, password });
                if (user) {
                    res.send("login successful");
                } else {
                    res.send("login failed")
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).send("Something went wrong");
            }
        })

        //4.API FOR LOGOUT FUNCTIONS
        app.get("/logout", function (req, res) {
            req.logout();
            res.redirect("/");
        })

    }
}