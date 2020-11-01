/* eslint-disable no-unused-vars */
//jshint esversion:6
require("dotenv").config();
// It is environment variable from npm named as dotenv. It should be declared at the start of file otherwise you will not be able to access the
// environmnet variabes later in the code
// First create a .env file in root directory and inside it the variables should be NAME=VALUE

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require("mongoose-encryption");
const app = express();

// We can access the env variables anywhere by 'process.env.VARIABLE_NAME'
// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// const secret = "Thisisoursecret";
// Place the above in .env file as SECRET_CODE or SECRET="Thisisoursecret" without spacingas per in dotenv mongoose webpage mentioned
// fullstop(.) part of key in env file
// Then replace the secret:secret with secret:process.env.SECRET
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });
// Pass the encrypt plugin before creating the mongoose model because we are passing the userSchema as parameter to mongoose model User

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("New User registered successfully");
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  // Remember that the hash created from Same string is always going to be the same

  User.findOne({ email: username }, function (err, foundData) {
    if (err) {
      console.log(err);
    } else {
      // Note that if email changed to name then also it shows the secrets so check if foundData is null or not
      if (foundData) {
        if (foundData.password == password) {
          // console.log(foundData);
          res.render("secrets");
        } else {
          res.send(
            "The password does not match with the email id. Kindly try again."
          );
        }
      } else {
        res.send("Data not found. plsease try again");
      }
    }
  });
});

app.listen(3000, function (req, res) {
  console.log("Server started at port 3000");
});
