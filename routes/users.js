const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User model
const Users = require("../models/Users")

router.get("/login", (req, res) => res.render("login"))

router.get("/register", (req, res) => res.render("register"))

router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body; password2
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: "Please make sure your passwords match" });
    }

    // Check password length

    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passed
        Users.findOne({ email: email }).then(users => {
            if (users) {
                // User exists
                errors.push({ msg: "Email is already registered"});
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else  {
                const newUsers = new Users({
                    name: name,
                    email: email,
                    password
                });
                
                // Hash Password
                bcrypt.genSalt(10,(error, salt) => bcrypt.hash(newUsers.password, salt, (error, hash) => {
                    if(error) throw err;
                    // Set password to hashed
                    newUsers.password = hash;
                    // Save User
                    newUsers.save().then(users => {
                        req.flash("success_msg", "You are now registered and can log in");
                        res.redirect('/users/login')
                    })
                }))
            }
        });
    }
});

// Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
})

module.exports = router;