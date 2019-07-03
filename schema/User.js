const mongoose = require("mongoose");
// import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    salary : Number
});

var User = mongoose.model("User", userSchema);

module.exports = User;