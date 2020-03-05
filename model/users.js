var mongoose = require('mongoose'),
    localMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    uid: String,
    username: String,
    name: String,
    gender: String,
    college: String,
    phone: String,
    password: String,
    events: [Number],
    paidstatus: {
        type: String,
        default: 'unpaid'
    }
});

userSchema.plugin(localMongoose);

var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
  });
  
var counter = mongoose.model('counter', CounterSchema);

userSchema.pre('save', function(next) {
if(!this.isNew) return next();
var doc = this;
counter.findOneAndUpdate({
    _id: 'entityId'
}, {
    $inc: {
    seq: 1
    }
}, {
    new: true,
    upsert: true,
}, function(error, counter)   {
    if(error)
        return next(error);

    doc.uid = `X${counter.seq+999}`;
    next();
    });
});

module.exports = mongoose.model("User", userSchema);
