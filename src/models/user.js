const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
  },
  about: {
    type: String,
  },
  skills: {
    type: [String],
  },
  photoUrl: {
    type: String,
    default: "https://geographyandyou.com/images/user-profile.png",
  },
});

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DevTinder@2003", {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
