const User = require('../models/user')
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator");
const expressJWT = require("express-jwt");

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    const { phone, name, password } = req.body
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }

    //checking user is already registered or not
    await User.countDocuments({ phone: phone }).then(count => {
        //throw err if user already registered
        if (count === 1) {
            return res.status(422).json({
                error: "phone already in use"
            })
        } else {
            const user = new User(req.body)

            user.save().then((newUser) => {
                var token = jwt.sign({ _id: newUser._id }, process.env.SECRET, {
                    expiresIn: "2h"
                });
                const { _id, name, phone, orders } = newUser;
                return res.json({ token, user: { _id, name, phone, orders } });
            }).catch(err => {
                return res.status(400).json({
                    error: "Not able to register user"
                })
            })
        }
    }).catch(err => {
        return res.status(400).json({
            error: err
        })
    })
}

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const { phone, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }

    //checking phone is registered or not
    User.findOne({ phone }).then(user => {
        if (user) {

            //checking password is correct or not
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Incorrect Password",
                });
            }

            //creating token
            var token = jwt.sign({ _id: user._id }, process.env.SECRET, {
                expiresIn: "2h"
            });

            //send response to frontend
            const { _id, name, phone, orders } = user;
            return res.json({ token, user: { _id, name, phone, orders } });
        } else {
            return res.status(400).json({
                error: "This phone number is not registered",
            });
        }
    }).catch(err => {
        return res.status(400).json({
            error: "This phone number is not registered",
        });
    })
}

exports.signout = (req, res) => {
    //CLEAR COOKIE
    res.clearCookie("token");
    res.json({
        message: "User signout",
    });
};

exports.isSignedin = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.auth = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

exports.isAuthenticated = (req, res, next) => {
    const { user_id } = req.body
    let checker = req.auth && (user_id == req.auth._id || req.query.user_id === req.auth._id);
    if (!checker) {
        return res.status(403).json({
            error: "You are not authenticated for this.",
        });
    }
    next();
};