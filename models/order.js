const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
        sub_total: {
            type: Number,
            default: 0,
        },
        phone: {
            type: Number,
            required: true,
            trim: true,
        },
        user_id: {
            type: ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };