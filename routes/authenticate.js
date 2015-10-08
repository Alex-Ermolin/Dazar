var express = require('express');
var router = express.Router();

module.exports = function(passport){

    //sends successful authentication state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure authentication state back to angular
    router.get('/failure', function(req, res){
        //store an array of the error message in a variable errors
        //the reason I am using an extra variable is because req.flash(...) deletes itself when accessed.
        //the variable errors stores all of the flashed errors throughout the scope of this function.
        var errors = req.flash('errMsg').slice(0);
        res.send({state: 'failure', user: null, error: errors[0]});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};