/* eslint-disable no-unused-vars */

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const e = require("express");
const _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Buy food",
});
const item2 = new Item({
  name: "Eat food",
});
const item3 = new Item({
  name: "Sleep",
});
const defaultArray = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [itemSchema]
  // array of itemSchema based items
});

const List = mongoose.model("List", listSchema);


// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];


app.get("/", function (req, res) {

  Item.find({}, function (err, founditems) {
    // console.log(res);
    if (founditems.length != 0) {
      res.render("list", { listTitle: "Today", newListItems: founditems });
    }
    else {
      Item.insertMany(defaultArray, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log('Succesfully added the tasks');
        }
      });
      res.redirect("/");
      // after the redirect the length of founditems will be 3 and so the web app will be rendered
    }

  });


});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  // console.log('Item is ' + itemName);
  var listName = req.body.list;
  console.log('listName is ' + listName);

  const newitem = new Item({
    name: itemName,

  });
  if (listName === "Today") {
    newitem.save();

    res.redirect("/");
  }
  else {
    // Trim the list for whitespaces
    listName = listName.trim();
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(newitem);
      // Add a newitem to this list
      foundList.save();
      // Save the foundList
      res.redirect("/" + listName
      );
    });
  }
  //   if (req.body.list === "Work") {
  //     workItems.push(item);
  //     res.redirect("/work");
  //   } else {
  //     items.push(item);
  //     res.redirect("/");
  // }
});

app.post("/delete", function (req, res) {
  const deleteid = req.body.checkbox;
  var listName = req.body.listName;
  listName = listName.trim();

  // If you donot trim the string then you get an error as the string has whitespaces
  const finalid = deleteid.trim();
  // console.log(deleteid);
  if (listName === "Today") {

    // findbyIdandRemove does not work without the callback
    Item.findByIdAndDelete(finalid, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Successfully deleted');
        res.redirect("/");
      }
    });
  } else {
    // $pull operator is used to delete the item from an array(search google for more) 
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: finalid } } }, function (err, foundlist) {
      if (err) {
        console.log(err + 'line 141');
      }
      else {
        res.redirect("/" + listName);
      }
    });
  }

  // findByIdandRemove() is deprecated

});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/:listName", function (req, res) {
  // console.log(req.params.listName);
  const customListName = _.capitalize(req.params.listName);
  List.findOne({ name: customListName }, function (err, foundlist) {
    if (err) {
      console.log(err);
    }
    else {
      if (!foundlist) {
        console.log('The list does not exist');
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultArray
        });
        list.save();
        res.redirect("/" + customListName);
      }
      else {
        console.log('exists');
        // Show an existing list
        res.render("list", { listTitle: foundlist.name, newListItems: foundlist.items });
      }
    }
  });



});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
