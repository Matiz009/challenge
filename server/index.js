const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());
const User = require("./models/userModel");

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://localhost:27017/challenge", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async() => {
        console.log("connected");
    });
app.post("/api/register", async(req, res) => {
    console.log(req.body);
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        res.send(user);
        res.json({ status: "ok" });
    } catch (err) {
        res.json({ status: "error", err: "Duplicate email" });
        console.log(err);
    }
});

app.post("/api/login", async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    });
    if (user) {
        const token = jwt.sign({
                email: user.email,
                name: user.name,
            },
            "secret123"
        );
        return res.send("Login Successfully " + "Token: " + token);
    } else if (!user) {
        return res.status(400).send("Failed");
    }
});
app.get("/hello", (req, res) => {
    res.send("hello world");
});

app.listen(1337, () => {
    console.log("server is running on 1337");
});