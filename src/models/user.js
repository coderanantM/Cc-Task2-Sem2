const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"),
SALT_WORK_FACTOR = 10;


const UserSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        index: { unique: true },

    },
    password:{
        type:String,
        required:true,
    },
    email_id:{
        type:String,
        required:true,
        index: { unique: true },
    },
});

UserSchema.pre('save', function (next) {
     var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
    
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
    
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = new mongoose.model("User", UserSchema);
module.exports = User;

 


