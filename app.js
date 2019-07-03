const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
// const fs = require("fs");

const db = require("./config/database");
const hb = require("./config/handlebars");
const users = require("./routes/users.js");
const notes = require("./routes/notes.js");
const articles = require("./routes/articles.js");

// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import path from "path";
// import fs from "fs";
// import db from "./config/database";
// import hb from "./config/handlebars"
// import users from "./routes/users"
// import notes from "./routes/notes"
// import articles from "./routes/articles"

var app = express();

//set template engine
app.engine("hbs", hb);
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname,"views")));
// //make way for some custom css, js and images
// app.use("/custom/css", express.static(__dirname + "/views/static/css/"));
// app.use("/custom/js", express.static(__dirname + "/views/static/js/"));
// app.use("/custom/imgs", express.static(__dirname + "/views/static/imgs/"));

app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname,"routes/")));
app.use("/users", users);
app.use("/notes", notes);
app.use("/articles", articles);

// //load all files in models dir
// fs.readdirSync(__dirname + "/schema/").forEach(function (filename) {
//     if (~filename.indexOf(".js")) require(__dirname + "/schema/" + filename)
// });

//Home route
app.get("/", (req, res) => {
    res.render("home");
});

module.exports = app;