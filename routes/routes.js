const express = require("express");
const app = express.Router();
const db = require('../models/')
// / Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

app.get("/", (req, res) => {
  res.render('index', {});
});

app.get("/scrape", function (req, res) {
  console.log("scraping");
  // First, we grab the body of the html with request
  axios.get("https://thehackernews.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function (i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      // Create a new Article using the `result` object built from scraping
      db.Scrape.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          res.redirect("/scrapes");
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    // res.render('articles', results);
    console.log("scrape done");
    // res.redirect('index', {});
    // res.json({
    //   result: 'scrape done'
    // });

  });
});

// Route for getting all scraped Articles from the db and displaying in articles.handlebars 
app.get("/scrapes", function (req, res) {
  console.log("app.get/scrapes");
  // Grab every document in the Articles collection
  db.Scrape.find({})
    .then(function (data) {
      var results = {
        articles: data,
        saved:false

      }
      // If we were able to successfully find Articles, send them back to the client
      // res.json(results);
      console.log(data[0].title);
      console.log(data[0].id);

      res.render('articles', results);
      // res.render('articles', {articles : JSON.stringify(dbArticle)});

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for getting all Saved Articles from the db and displaying in articles.handlebars 
app.get("/articles", function (req, res) {
  console.log("app.get/articles");
  // Grab every document in the Articles collection
  var saved = true;
  db.Article.find({})
    .then(function (data) {
      var results = {
        articles: data,
        saved: true
      }
      // If we were able to successfully find Articles, send them back to the client
      // res.json(results);
      console.log(data[0].title);
      console.log(data[0].id);

      res.render('articles', results);
      // res.render('articles', {articles : JSON.stringify(dbArticle)});

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//route for saving article

app.post("/articles/", function (req, res) {
  db.Article.create(req.body)
    .then(function (data) {
      // View the added result in the console

      console.log(data);
      // var results = {
      //   article: data,
      //   note: data.notes
      // }
      res.send(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

// Route for grabbing a One Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  console.log("APP.GET /articles/:id populated");
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({
      _id: req.params.id
    })

    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function (data) {

      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log(data);
      var results = {
        article: data,
        note: data.notes
      }
      res.render('article', results);
      // console.log(data);
      // res.json(data);

      // res.json(dbArticle);

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving an Article's associated Note
app.post("/notes/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  console.log("/notes/:id to POST a note to an article");
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      // return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          notes: dbNote._id
        }
      }, {
        new: true
      });

    })
    .then(function (data) {
      var results = {
        note: data

      }
      // If we were able to successfully update an Article, send it back to the client
      res.render('article', results);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//route for update an articles note
app.put("/notes/:id", function (req, res) {
  console.log("updating the note");
  db.Note.update({
      "_id": req.params.id
    }, {
      // Set "read" to false for the book we specified
      $set: {
        "title": req.body.title,
        "body": req.body.body
      }
    },
    // When that's done, run this function
    function (error, edited) {
      // Show any errors
      if (error) {
        console.log(error);
        res.send(error);
      }
      // Otherwise, send the result of our update to the browser
      else {
        console.log(edited);
        var results = {
          note: edited
        }
        // If we were able to successfully update an Article, send it back to the client
        res.render('article', edited);
        // res.send(edited);
      }
    });
});


//route for del of note
app.delete("/notes/:noteid/:articleid", function (req, res) {
  console.log("first removing the note from article");

  db.Article.update({
      "_id": req.params.articleid
    }, {
      // Set "read" to false for the book we specified
      "$pull": {
        "notes": req.params.noteid
      }
    },
    function (error, deleted) {
      // Show any errors
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log("note removed from article");
        db.Note.findByIdAndRemove(req.params.noteid, function (err, removed) {
          if (err)
            res.send(err);
          else
            res.json({
              removed: 'note Deleted!'
            });

        }); //end findByIdAndRemove
      } //end else
    }); //end DBarticle update

}); //endapp.delete

/// Route for grabbing a One Article by id, populate it with it's note
app.get("/notes/:id", function (req, res) {
  console.log("APP.GET /notes/:id");
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Note.findOne({
      _id: req.params.id
    })

    // ..and populate all of the notes associated with it
    .then(function (data) {

      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log(data);
      // var results = {
      //   note: data.note
      // }
      // res.render('create.note', results);
      console.log(data);
      res.json(data);

      // res.json(dbArticle);

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


module.exports = app;