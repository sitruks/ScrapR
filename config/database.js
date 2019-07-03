const mongoose = require("mongoose");
// import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ScrapR";

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI);
  
} else {
  
  mongoose.connect(db, function (err) { db = "mongodb+srv://sitruk:poop@articles-etwtt.mongodb.net/test?retryWrites=true&w=majority"
  if (err) {
    console.log(err);
  } else {
    console.log('mongoose connection is successful on: ' + db);
  }
});
}

// keeping in case urlparser needed
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected to MongoDB database")
});

module.exports = db;