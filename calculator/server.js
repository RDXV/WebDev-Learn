// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

// app.get()
app.get('/',function(req,res)
{
  // res.send('Hello World');
  console.log(__dirname+ "/index.html");
  res.sendFile(__dirname+ "/index.html");
});

/*
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
*/
app.post("/",function(req,res)
{
  console.log(req.body);
  var num1=parseInt(req.body.num1);
  // can also use Number(req.body.num1);
  var num2 = parseInt(req.body.num2) ;
  var result = num1+num2;
  res.send('The result of the calculation is '+result);


});

app.listen(3000,function()
{
  console.log('Server at port 3000 has been started');
});
