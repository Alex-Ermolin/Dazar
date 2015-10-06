var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {

        console.log('serializing user:',user._id);
        //return the unique id for the user
        return done(null, user._id);
    });

    //Deserialize user will call with the unique id provided by serializer
    passport.deserializeUser(function(id, done) {

        return done(null, User.findById(id, function(err, user) {
            //If there is a db error
            if(err) {
                var errMessage = "Can't deserialize using id " + id + ", error: " + err;
                return done(errMessage, false);
            }

            //if a user with that id is not found
            if(!user) {
                return done('User not found in db!', false);
            }

            //successful deserialization
            return done(null, user);
        }));


    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            User.findOne({username: username}, function(err, user) {

                //in case there was an error in the db
                if(err) {
                    return done('db error: ' + err, false);
                }

                //if the username is not found
                if(!user) {
                    return done('Username ' + username + ' not found!', false);
                }

                //if the password is incorrect
                if(!isValidPassword(user, password)) {
                    return done('Invalid password!', false)
                }

                //successful login
                return done(null, user);

            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            User.findOne({username: username}, function(err, user) {

                //in case there was an error in the db
                if(err) {
                    return done('db error: ' + err, false);
                }

                //if the user is found, check if the password is correct
                if(user) {
                    return done('Username ' + username + ' is taken!', false);
                }

                var newUser = new User();
                newUser.ussername = username;
                newUser.password = createHash(password);
                newUser.save(function(err) {
                    if(err) {
                        console.log('Error when trying to save new user: ' + err);
                        throw err;
                    }
                    console.log(newUser.username + ' Successfully registered on Dazar!');
                    return done(null, newUser);
                })

            });
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

};