var mongoose = require('mongoose'),
    localMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    gender: String,
    college: String,
    phone: String,
    password: String
});

UserSchema.plugin(localMongoose);

module.exports = mongoose.model("User", UserSchema);
