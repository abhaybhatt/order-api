const express = require("express");
const { signup, signin } = require('../controllers/auth')
const { check } = require('express-validator');
const router = express.Router()

router.post("/add-user", [
    check("name").isLength({ min: 3 }).withMessage("Name should be of atleast 3 characters"),
    check("password").isLength({ min: 5 }).withMessage("password should be of atleast 5 characters"),
    check("phone").isLength({ min: 5 }).withMessage("phone number should be of atleast 5 digits")
], signup)


router.post("/login-user", [
    check("password").isLength({ min: 5 }).withMessage("password should be of atleast 5 characters"),
    check("phone").isLength({ min: 5 }).withMessage("phone number should be of atleast 5 digits")
], signin)
module.exports = router