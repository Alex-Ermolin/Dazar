/**
 * Created by Alex on 08/10/2015.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {title: "Dazar!"});
});

module.exports = router;