// jshint esversion:6
// jshint esversion:8
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const client = require("mailchimp-marketing");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  var firstname = req.body.fname;
  var lastname = req.body.lname;
  var email = req.body.email;
  console.log('Firstname is ' + firstname + " last name is " + lastname + " email is " + email);

  // var options = {
  //   url: "https://server.api.mailchimp.com/3.0/lists/",
  //
  // };
  //   request(options,function(err,res,body)
  // {
  //
  // });
  client.setConfig({
    apiKey: "0e2ddefe6fecc4a82219aba0e8e44304-us8",
    server: "us8",
  });

  const run = async () => {
    const response = await client.lists.getList("842300c94c");
    console.log(response);
  };

  run();


});
app.listen(3000, function() {
  console.log('Server started at port 3000');
});
// API key
// 0e2ddefe6fecc4a82219aba0e8e44304-us8

// Mailchimp List ID
// 842300c94c

// https://server.api.mailchimp.com/3.0/lists/
