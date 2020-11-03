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
// Look in udemy/Authentication/11. Passport for express-session, passport etc
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
// No need to explicitly require passport-local as it will be used automatically by passport-local-mongoose
const app = express();

// The order of the code matters as to where session is initialized, passport used as app.use(passport...) etc

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Mention the session before connecting server and after the app is created and body parser etc used
app.use(
  session({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false,
  })
);
// See express-session documentation to see what session,resave etc means
// secret string is for session id  secret used to sign the session ID cookie. This can be either a string for a single secret, or an array of multiple
// secrets. If an array of secrets is provided, only the first element will be used to sign the session ID cookie, while all the elements will be
// considered when verifying the signature in requests.

// resave - Forces the session to be saved back to the session store, even if the session was never modified during the request. See more on package info

// Now we initialize the passport package and use passport for dealing with session
// We are using express based application and creating our own auhentication
app.use(passport.initialize());
app.use(passport.session());

// To use Passport in an Express or Connect-based application, configure it with the required passport.initialize() middleware. If your application uses
// persistent login sessions (recommended, but not required), passport.session() middleware must also be used.
// Check out the passport documentation to understand how fully passport works

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
// The abbove line for removing deprecation warning

const userSchema = new mongoose.Schema({
  // email: {
  //   type: String,
  //   required: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  // },
  email: String,
  password: String,
  // For google authentication we need to add gogle id
  googleId: String,
  // Amend schema by adding secret array for storing the user's secrets
  secret: String,
  // Later try for array of secrets
});

userSchema.plugin(passportLocalMongoose);
// We are going to use the above plugin for hashing and salting our passwords and to save our users in mongoDB database
userSchema.plugin(findOrCreate);

var User = mongoose.model("User", userSchema);
// Now implement passport-local configurations
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// You cant put the below above session as first the cookie session must start
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      // This function contains what we get back from google
      // console.log(profile._json);
      // We need to save profile.id to login user as mongoDB contains automatically generated id and not the real id
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
// Serialize and de-serialize are used during sesisons where serialize is used to create a cookie carrying session info and de-serialize is used to
// get crumble the cookie and get the message using passport
// We have to write more code using passport and passport-local but as we are using passport-local-mongoose we have to write the passport.use,
// passport.serialize/deserialize for implementing the serialization which requires less code
// Go to passport npm and search serialize for its version of serialzing and deserializing

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/secrets", function (req, res) {
  // if (req.isAuthenticated()) {
  //   res.render("secrets");
  // } else {
  //   res.redirect("/login");
  //   console.log("You must be logged in to go to secrets page");
  // }
  // Not just show secrets page but show all anonymous secrets
  User.find({ "secret": { $ne: null } }, function (err, foundUsers) {
    // Dont forget double quots for secret
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", { usersWithSecrets: foundUsers });
      }
    }
  });
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

// app.get("/auth/google", function (req, res) {
//   console.log("auth invoked google");
//   passport.authenticate("google", {
//     scope: ["profile"],
//     successRedirect: "/profile",
//     failureRedirect: "/",
//   });
//   // Should be enough to bring pop-up asking user to sign up
// });

// Above is WRONG code
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"], failureRedirect: "/" })
);

// Once the user gets signed in from google then get request to auth/google/callback (secrets in this case)
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: "Authentication by google failed. Please try again",
  }),
  function (req, res) {
    // Successful authentication
    res.redirect("/secrets");
  }
);

app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
    console.log("You must be logged in to go to secrets page");
  }
});

app.post("/register", function (req, res) {
  // See at passport-local-mongoose by searching User.register as example code
  const userName = req.body.username.trim();
  const pass = req.body.password.trim();
  User.register({ username: userName }, pass, function (err, user) {
    // When in schema the username and password were necessary then validation error
    // Although even if you do not make them necessary, passport-local-mongoose handles the username,password errors
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
        // Earlier we did not have a secrets route as we were using register,login to go there directly but now as we are authenticating, we can specify
        // get route for secrets which will take only when the user is logged in
      });
    }
  });
});

app.post("/login", function (req, res) {
  // If we are logged in, our session is saved and gets over if we logout or remove cookie
  // When server is restarted the cookie gets deleted so remember that
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });

  req.logIn(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/submit", function (req, res) {
  const newSecret = req.body.secret;
  // Take the secret and save it isndie the user's secrets
  // passport handles the authenctication through req.user
  // console.log(req.user);
  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = newSecret;
        foundUser.save(function () {
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.listen(3000, function (req, res) {
  console.log("Server started at port 3000");
});

// Watch the authentication video few times to understand everything completely
// Also look at the npm packages of passport, passport-local, passport-local-mongoose, last bookmark of how to implement passport and passport DOCS
