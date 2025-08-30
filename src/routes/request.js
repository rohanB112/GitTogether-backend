const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middlewires/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params.status;
      const toUserId = req.params.toUserId;

      //Allowed status
      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: status + ` is invalid status type`,
        });
      }

      //If toUser does not exist
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found!" });
      }

      //If connection already exist
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      //If fromUserId = toUserId then schema.pre() method will validate the request

      const connectionRequestInstance = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequestInstance.save();
      res.status(200).json({
        message: "Connection request sent sucessfully.",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUserId = req.user._id;

      //Allowed
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "No connection request found",
        });
      }

      connectionRequest.status = status;
      data = await connectionRequest.save();

      res.status(200).json({
        message: "Connection request " + status,
        data,
      });
    } catch (err) {
      res.send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
