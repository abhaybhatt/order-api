require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const AuthRoutes = require('./routes/auth')
const OrderRoutes = require('./routes/orders')
const cors = require("cors");

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/", AuthRoutes)
app.use("/", OrderRoutes)
app.get("/", (req, res) => res.send("hello"))

const port = process.env.PORT || 8000;

mongoose
    .connect(process.env.DATABASE)
    .then(() => {
        console.log("DB CONNECTED");
    });


app.listen(port, () => {
    console.log(`app running at ${port}`)
});

module.exports = app