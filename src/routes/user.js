const express = require("express");

const userRouter = express.Router();
const { userAuth } = require("../middlewires/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "skills",
      "about",
      "photoUrl",
      "gender",
    ]);

    // const data = connectionRequests.map((row) => {
    //   return row.fromUserId;
    // });

    res.status(200).json({
      message: "Connection requests fetched succssfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERRPR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUserId,
          status: "accepted",
        },
        {
          toUserId: loggedInUserId,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl",
        "about",
      ]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUserId)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select([
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl",
      ])
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
