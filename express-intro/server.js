// jshint esversion:6
const express = require('express');

const app=express();
app.get('/',function(req,res)
{
  // console.log(req);
  console.log('hello');
  res.send('hello world');
});

app.get('/contact',function(req,res)
{
    res.send("<b>The contact info is abcd@email.com  </b>");
});

app.get('/hobbies',function(req,res)
{
  res.send('My hobby is to code');
});

app.listen(3000,function()
{
  console.log('Server started on port 3000');
});
