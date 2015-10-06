var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');


module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done){
            console.log('serializing user:', user.username);
            return done(null, user.username);
        });

    passport.deserializeUser(function(username, done){
        return done(null, users[username]);
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User.findOne({ 'username' :  username },
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false);
                    }
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false);
                    }
                    return done(null, user);
                }
            );
        }
    ));

    passport.use('signup', new LocalStrategy({

                passReqToCallback : true // allows us to pass back the entire request to the callback

            },
            function(req, username, password, done) {

                User.findOne({ username : username },function(err, user ) {
                    if(err){
                        return done('db error:' + err, false);

                    }
                    if(user){
                        return done('User name ' + username + ' is taken', false );

                    }

                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.save(function(err){
                        if(err) {
                            console.log('error : ' + err);
                            throw err;
                        }

                        console.log(newUser.username + 'Successfully registered on Dazar');
                        return done(null, newUser);

                    });
                });
            })
        );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};