const express = require("express");
const router = express.Router();
const { isSignedin, isAuthenticated } = require("../controllers/auth");
const { check } = require('express-validator')
const {
    createOrder,
    getAllOrders,
    // pushOrder,
    getOrderbyId
} = require("../controllers/order");


router.post(
    "/add-order",
    [
        check("user_id").isLength({ min: 1 }).withMessage("user id can not be empty"),
        check("phone").isLength({ min: 5 }).withMessage("phone number should be of atleast 5 digits")
    ],
    isSignedin,
    isAuthenticated,
    // pushOrder,
    createOrder
);

router.get(
    "/get-order",
    isSignedin,
    isAuthenticated,
    getAllOrders
);


module.exports = router;