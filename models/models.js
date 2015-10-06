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
