const express = require("express");
const connectDB = require("./configs/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

require("dotenv").config();
console.log(process.env.MONGODB_CONNECTION_STRING);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("connected to DB successfully.");
    app.listen(process.env.PORT, () => {
      console.log("listening on port 3000.");
    });
  })
  .catch((err) => {
    console.log("Cannot connect to the DB.");
  });
