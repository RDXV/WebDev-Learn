/* eslint-disable no-unused-vars */

// Check the D:/udemy/web dev/mongoose videos for more clear understanding
// const db = require('mongodb');
const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/fruitsDB";
// If the database is not created then it created the fruitsDB

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
// after port there is the name of the database to be connected

const fruitSchema = new mongoose.Schema({
    // name: String,
    name: {
        type: String,
        // required: true, or 
        required: [true, "You must specify the name of fruit"],
        // the message is when the required condition is not met
    },
    // rating: Number,
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

// const Fruit has Fruit with capital F as a convention and then const fruit as new onject in colletion fruits from Fruit made(comment below)
const Fruit = mongoose.model("Fruit", fruitSchema);
// Model is like the collection and here the Fruit's F will be lowerized and s added at the end in db when (show collections in mongodb shell)

const fruit = new Fruit({
    // name: "Peach",
    rating: 10,
    review: "I love peach"
});

// fruit.save();
// It calls the save method to save this fruit document into the Fruit collection inside our fruitsDB

// const lichi = new Fruit({
//     name: "lichi",
//     rating: 9,
//     review: "I dont know the spelling but it tastes good",
// });

// lichi.save();

const pineapple = new Fruit({
    name: "pineapple",
    rating: 7,
    review: "Tastes good",
});
pineapple.save();

const personSchema = mongoose.Schema({
    name: String,
    age: Number,
    // To establish a relation with another database we have to use their schema as an object data
    favouriteFruit: fruitSchema,
});

const Person = mongoose.model("Person", personSchema);
const person = new Person({
    name: "Raju",
    age: 25,
    // favouriteFruit: lichi,
    // The new object created fruit is the fruitSchema to be used as the favourite fruit 
});

// person.save();
// uncomment to save each person and below for the fruits



// const kiwi = new Fruit({
//     name: "kiwi",
//     rating: 10,
//     review: "I love it"
// });

// const banana = new Fruit({
//     name: "banana",
//     rating: 8,
//     review: "Nice"
// });

// Fruit.insertMany([kiwi, banana], function (err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log('Successfully saved the fruits to FruitsDB');
//     }
// });

// The above was for insertion

// Fruit.find(function (err, fruits) {
//     if (err) {
//         console.log(err);
//     } else {
//         // console.log(fruits);
//         mongoose.connection.close();
//         fruits.forEach(element => {
//             console.log(element.name);
//         });

//         // To close the database
//     }

// });
// The above is searching in the database

// To update the database
// Fruit.updateOne({ _id: "5f9827bbc2f30c35886d853a" }, { name: "Peach" }, function (err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log('Successful name changed ');
//     }
// });
// The _id is from the cmd when the peach data was added without name as required. So now we are updating it

Person.updateOne({ _id: "5f9840d7f93706279c70605d" }, { favouriteFruit: pineapple }, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Successfully updated pineapple to Mohan');
    }
});

// The below is for deleting element in the database
// Fruit.deleteOne({ name: "Peach" }, function (err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log('Successfully deleted  the element ');
//     }
// });

// The below is for deleteMany
// Person.deleteMany({ name: "Mohan" }, function (err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log('Successfully deleted all the records named Mohan');
//     }
// });



// const { MongoClient } = require("mongodb");
// // Connection URL
// var url = 'mongodb://localhost:27017';
// // Use connect method to connect to the Server
// var dbName = 'fruitDB';

// const client = new MongoClient(url, { useUnifiedTopology: true });

// async function run() {
//     try {
//         await client.connect();

//         const database = client.db('sample_mflix');
//         const collection = database.collection('movies');

//         // Query for a movie that has the title 'Back to the Future'
//         const result = await collection.insertOne(
//             {
//                 "name": "Avengers",
//                 "characters": [
//                     "Iron Man",
//                     "Thor",
//                     "Captain America"
//                 ]
//             }
//         );
//         // const query = { title: 'Back to the Future' };
//         // const movie = await collection.findOne(query);

//         // console.log(movie);
//         // console.log(result);
//         const movie = await collection.findOne({ name: "Avengers" });
//         console.log(movie);
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

// const { MongoClient } = require("mongodb");

// // Replace the uri string with your MongoDB deployment's connection string.
// const uri =
//     "mongodb+srv://Varun:GEd6hrxDMZucTV04@cluster101.pokin.mongodb.net/sample_mflix?retryWrites=true&w=majority";


