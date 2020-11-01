/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        // console.log(foundArticles);
        res.send(foundArticles);
      }
    });
  })

  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);
    // console.log(req.body);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully added new item");
      }
    });
    // we can check for errors inside the save() to see whether item inserted  properly or not
    // You can check Postman app and 6th video in 30th Build your own api udemy to see full
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted all");
        res.redirect("/articles");
      }
    });
  });
////////////////////////////////////////////////REQUESTS TARGETING A SPECIFIC ARTICLE////////////////////////////////////////////////////////
app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (
      err,
      foundArticle
    ) {
      if (err) {
        console.log(err);
      } else {
        res.send(foundArticle);
      }
    });
  });
// app.get("/articles", function (req, res) {
//     Article.find(function (err, foundArticles) {
//         if (err) {
//             res.send(err);
//         }
//         else {
//             // console.log(foundArticles);
//             res.send(foundArticles);
//         }

//     });
// });

// you can use app.route() to use multiple things like get(),post() and delete() at same route
// see documentation from express js website

// app.post("/articles", function (req, res) {
//     console.log(req.body.title);
//     console.log(req.body.content);
//     // console.log(req.body);
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function (err) {
//         if (err) {
//             res.send(err);
//         }
//         else {
//             res.send('Succesfully added new item');
//         }

//     });
//     // we can check for errors inside the save() to see whether item inserted  properly or not
//     // You can check Postman app and 6th video in 30th Build your own api udemy to see full
// });

// To delete an item we use app.delete()
// app.delete("/articles", function (req, res) {
//     Article.deleteMany(function (err) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log('Successfully deleted all');
//         }
//     });
// });

app.listen(3000, function () {
  console.log("Server started at port 3000");
});
