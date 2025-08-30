const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //Validate signup data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    //create an instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    //save the user in the db
    const savedUser = await user.save();
    //create token by using _id of the user
    const token = await savedUser.getJwt();

    //store the cookie in the response
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJwt();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(200).json({
        message: "Log in successful",
        user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).send("Logged out successfully.");
});

module.exports = authRouter;
