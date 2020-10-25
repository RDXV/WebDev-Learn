// jshint esversion:6
const express = require('express');
// NOTE: To use static css and images in server with html file having bootstrap as cdn we use a different function otherwise css and images static will not
// be loaded and it is - app.use(express.static("public")); which would mean that if css files inside the publc folder, then server loads them.
// Also define href of css relatively from the public folder. if css file inside CSS folder then href="CSS/styles.css"
const app =express();
const request = require('request');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res)
{
  res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res)
{
  // res.write('The value of ')
   console.log(req.body);
   var crypto = String(req.body.crypto);
   var currency = String(req.body.currency);

   res.write('The crypto you chose is ' + crypto + ' and the currency you chose is ' + currency);

   request("https://apiv2.bitcoinaverage.com/constants/exchangerates/global",function(err,res,body)
 {
   console.log(res);
   console.log(body);
 });
   res.send();
});

app.listen(3000,function()
{
  console.log('Server has been started at port 3000');
});
