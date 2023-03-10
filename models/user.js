const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');

var userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        encry_password: {
            type: String,
            required: true
        },
        salt: String,
        orders: {
            type: Array,
            default: [],
        },
    },
    { timestamp: true }
);

userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;         //_password -> _ represent private variable
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    securePassword: function (plainpassword) {
        if (!plainpassword) return "";
        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainpassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },

    authenticate: function (plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password;
    },
};

module.exports = mongoose.model("User", userSchema);