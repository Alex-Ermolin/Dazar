<<<<<<< HEAD
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
});

var postSchema = new mongoose.Schema({
    created_by: { type: Schema.ObjectId, ref: 'User' },
    created_at: {type: Date, default: Date.now},
    text: String
});

mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);
=======
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    created_at: {type: Date, default: Date.now}
});

var postSchema = new mongoose.Schema({
    text: String,
    created_by: {type: Schema.ObjectID, ref: 'User'},
    created_at: {type: Date,default: Date.now}
});

//define models User, Post
mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);
>>>>>>> 38ac0b97c39b83b1c4deae8e84266cfc0bf9ac4d
