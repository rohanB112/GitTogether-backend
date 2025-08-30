const express = require("express");
const { userAuth } = require("../middlewires/auth");
const { validateProfileUpdateData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    user = req.user;

    if (!user) {
      res.status(400).send("No user found.");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isUpdateAllowed = validateProfileUpdateData(req);

    if (!isUpdateAllowed) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile updated successfuly.`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
