/* eslint-disable no-unused-vars */

// shortcut for module.exoprts is just exports
exports.getdate = function () {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    return today.toLocaleDateString("en-IN", options);

};
// console.log(module);
// module is a javacsript object and has various methods which can be searched on node website  

exports.getday = function () {
    const today = new Date();
    const options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-IN", options);

};

// console.log(module.exports);

// module.exports now have 2 functions getday and getdate and they have to be accessed as
// const date = require(__dirname + "/date.js");
// var day = date.getday();
// var date = date.getdate();