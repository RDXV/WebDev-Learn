/* eslint-disable no-unused-vars */

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");

// Always place it below the app=express() line because the app does not exist until this line is typed giving error-> App used before it was declared
app.set("view engine", "ejs");

// To use ejs we have to create a new folder called view and then create a new ejs file (look into documentation to read the same)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public")); // To put in css file locally into the webpage
var newitem;
const items = [];
const workitems = [];
app.get("/", function (req, res) {
  // res.send("hello");
  var day = date.getdate();

  res.render("list", { listTitle: day, arr: items },);
  // renders a file called list and passes the variable values
  // list muse tbe inside the views folder and have ejs extension
});

app.post("/", function (req, res) {
  // console.log(req.body);
  const item = req.body.task;
  if (req.body.button == "Work") {
    workitems.push(item);
    res.redirect("/work");
  }
  else {
    newitem = req.body.task;
    if (newitem != "") {
      items.push(newitem);
    }
    res.redirect("/");
  }


  // res.render("list", { arr: items });
  // donot res.render as then kindofday error plus it is getting rendered at home route via res.get

});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", arr: workitems });
});

app.get("/about", function (req, res) {
  res.render("about");
});


app.listen(3000, function () {
  console.log("Server started at port 3000");
});
