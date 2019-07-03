const mongoose = require("mongoose");
// import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sitruk:poop@articles-etwtt.mongodb.net/test?retryWrites=true&w=majority" || "mongodb://localhost/ScrapR";
// user:admin pw:password123

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to MongoDB database")
});

module.exports = db;