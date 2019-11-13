const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load User Model
const Users = require("../models/Users");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email"}, (email, password, done) => {
            // Match User
            Users.findOne({ email: email}).then(users => {
                if(!users) {
                    return done(null, false, { message: "That email is not registered"});
                }

                // Match password
                bcrypt.compare(password, users.password, (error, isMatch) => {
                    if(error) throw error;

                    if(isMatch) {
                        return done(null, users);
                    } else {
                        return done(null, false, { message: "Password incorrect"});
                    }
                });
            })
        })
    );

    passport.serializeUser((users, done) => {
        done(null, users.id);
    });

    passport.deserializeUser((id, done) =>{
        Users.findById(id, (error, users) => {
            done(error, users);
        });
    });
}