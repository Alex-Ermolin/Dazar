var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
});

var editSchema = new mongoose.Schema({
    edited_by: {type: mongoose.Schema.ObjectId, ref: 'User'},
    edited_at: {type: Date, default: Date.now},
    editing_reason: {type: String, default: ""}
});

var postSchema = new mongoose.Schema({
    created_by: {type: mongoose.Schema.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now},
    text: String,
    edits: {type: [{type: mongoose.Schema.ObjectId, ref: 'Edit'}], default: []}
});

mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);
mongoose.model('Edit', editSchema);
