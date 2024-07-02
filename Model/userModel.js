const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 200,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 200,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    maxlength: 200,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  bio: {
    type: String,
    default: null,
    maxlength: 450,
    trim: true,
  },
});

module.exports = mongoose.model("User", userSchema);
