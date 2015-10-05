var express = require('express');
var router = express.Router();

router.route('/posts').get(function(req, res) {
	res.send({message: 'TODO: show all posts'});
}).post(function(req, res) {
	res.send({message: 'TODO: add a new post'});
});

router.route('/posts/:id')
	
	//returns a post based on id in url
	.get(function(req, res) {
		res.send({message: 'TODO: return post with id ' + req.params.id});
	})
	//update existing post
	.put(function(req, res) {
		res.send({message: 'TODO: update existing post with id ' + req.params.id});
	})
	//delete existing post
	.delete(function(req, res) {
		res.send({message: 'TODO: delete existing post with id ' + req.params.id});
	});

module.exports = router;