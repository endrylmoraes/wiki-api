const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("articles", articleSchema);

// ******************** Requests targeting all articles ********************

app.route("/articles")
// List all articles
.get(function (req, res) {
  Article.find(function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
// Create article
.post(function (req, res) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function (err) {
    if (!err) {
      res.send("Sucessfully added a new article.");
    } else {
      res.send(err);
    }
  });
})
// Delete all articles
.delete(function (req, res) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("Sucessfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

// ******************** Requests targeting a specific article ********************

app.route("/articles/:articleTitle")
// Get an specific article
.get(function (req, res) {
  Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
    if (!err) {
      res.send(foundArticle);
    } else {
      res.send(err);
    }
  });
})
// Update full article
.put(function (req, res) {
  Article.replaceOne(
    { title: req.params.articleTitle },
    {
      title: req.body.title,
      content: req.body.content
    },
    {overwrite: true},
    function (err) {
      if (!err) {
        res.send("Sucessfully updated!");
      } else {
        res.send(err);
      }
    }
  );
})
// Update a part of an article
.patch(function (req, res) {
  Article.updateOne(
    { title: req.params.articleTitle },
    { $set: req.body },
    function (err) {
      if (!err) {
        res.send("Sucessfully updated!");
      } else {
        res.send(err);
      }
    }
  );
})
// Delete a specific article
.delete(function (req, res) {
  Article.deleteOne({ title: req.params.articleTitle }, function (err) {
    if (!err) {
      res.send("Sucessfully deleted.");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
