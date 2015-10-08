var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Edit = mongoose.model('Edit');

//Used for routes that must be authenticated.
function isAuthenticated(req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
}

router.use('/posts', isAuthenticated);

router.route('/posts')

	//show all posts
	.get(function(req, res) {
		Post.find(function(err, posts) {
			if(err) {
				return res.send(500, err);
			}
			return res.send(200, posts);
		});
	})

	//create a new post
	.post(function(req, res) {
		var newPost = new Post();
		newPost.text = req.body.text;
		newPost.created_by = req.body.created_by;
		newPost.save(function(err, post) {
			if(err) {
				return res.send(500, err);
			}
			return res.json(post);
		});
});

router.route('/posts/:id')
	
	//returns a post based on id in url
	.get(function(req, res) {
		var postId = req.params.id;
		Post.findById(postId, function(err, post) {
			if(err) {
				return res.send(500, err);
			}
			return res.json(post);
		});
	})

	//update existing post
	.put(function(req, res) {
		var postId = req.params.id;
		Post.findById(postId, function(err, post) {
			if(err) {
				res.send(500, err);
			}

			//create and save a new edit object
			var newEdit = new Edit();
			newEdit.edited_by = req.body.edited_by;
			if(req.body.editing_reason) {
				newEdit.editing_reason = req.body.editing_reason;
			}
			newEdit.save(function(err) {
				if(err) {
					return res.send(500, err);
				}
			});

			//change the text in the original post
			post.text = req.body.text;

			//add the newest edit to the array of edits of the post
			post.edits.push(newEdit);

			//save the changes made to post
			post.save(function(err, post) {
				if(err) {
					return res.send(500, err);
				}
				return res.json(post);
			});
		});
	})

	//delete existing post
	.delete(function(req, res) {
		var postId = req.params.id;
		Post.remove({_id: postId}, function(err) {
			if(err) {
				return res.send(500, err);
			}
			return res.json({message: 'removed post with id ' + postId});
		});
	});

module.exports = router;