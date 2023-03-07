const { Order } = require("../models/order");
const { validationResult } = require("express-validator");
const User = require("../models/user");


exports.createOrder = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }
    const order = new Order(req.body);
    order.save().then((newOrder) => {
        pushOrder(req).then(r => {
            return res.json(order);
        })

    }).catch(err => {
        console.log(err)
        return res.status(400).json({

            error: "failed to place order",
        });
    })
};

async function pushOrder(req) {
    let orders = [{
        user_id: req.body.user_id,
        phone: req.body.phone,
        sub_total: req.body.sub_total,
    }];

    //store thi in DB
    await User.findOneAndUpdate(
        { _id: req.body.user_id },
        { $push: { orders: orders } },
        { new: true },
    ).then(res => {
        return res
    }).catch(err => {
        return res.status(400).json({
            error: "Unable to save purchase list"
        });
    })
}

exports.getAllOrders = (req, res) => {
    const user_id = req.query.user_id
    Order.find({ user_id: user_id })
        .then(order => {
            res.json(order);
        }).catch(err => {
            return res.status(400).json({
                error: "No orders found in DB",
            });
        })
};

