// Load the 'express' module which makes writing webservers easy.

const express = require("express");

const ejs = require("ejs");
const mongoose = require("mongoose");
const req = require("express/lib/request");

// Start the express application and save a reference to it in the app variable.
const app = express();

app.set("view engine", "ejs");

// Add facility.
app.use(express.static("public"));

// Connection with MongoDB

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

// Created article Schema

const articleSchema = {
  title: String,
  content: String,
};

//Article model

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////Request Targeting all Articles//////////////////////////

app
  .route("/articles")
  //GET Route for all of the articles.
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  // POST creates one new article.
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  // DELETE delete all articles.
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////////Request Targeting A Specific Articles//////////////////////////

app
  .route("/articles/:articleTitle")

  //req.params.articleTitle = "jQuery"

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found.");
        }
      }
    );
  })
  // Entire replace all data.
  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted the correspondin article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3011, function () {
  console.log("Server started on port 3011");
});
