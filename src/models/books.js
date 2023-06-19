const express = require("express");
const mongoose = require("mongoose");

const book_rating = new mongoose.Schema({
    Title:{
        type:String,
        required:true,

    },

    Author:{
        type:String,
        required:true,
        trim:true,
    },

    price: {
        type: Number,
        required: true
      },
      rating: {
        type: Number,
        required: true
      }
 });

 const Book_rating = new mongoose.model("Book_rating", book_rating);
 module.exports = Book_rating;