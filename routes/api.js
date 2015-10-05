var express = require('express');
var router = express.Router();
//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
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
};

router.use('/posts', isAuthenticated);

router.route('/posts')

    .get(function(req, res) {
	    res.send({message: 'TODO: show all posts'});
    })

    .post(function(req, res) {
	    res.send({message: 'TODO: add a new post'});
    });

router.route('/posts/:id')

	.get(function(req, res) {
		res.send({message: 'TODO: return post with id ' + req.params.id});
	})

	.put(function(req, res) {
		res.send({message: 'TODO: update existing post with id ' + req.params.id});
	})

	.delete(function(req, res) {
		res.send({message: 'TODO: delete existing post with id ' + req.params.id});
	});

module.exports = router;