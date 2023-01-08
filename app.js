//jshint esversion:6

const express = require("express");

const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

// Connection with MongoDB

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

// Created article Schema

const articleSchema = {
  title: String,
  content: String,
};

//Article mode l

const Article = mongoose.model("Article", articleSchema);

//GET Route for all of the articles.

app.get("/articles", function (req, res) {
  Article.find(function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

// POST creates one new article

app.post("/articles", function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
});

app.listen(3011, function () {
  console.log("Server started on port 3011");
});
