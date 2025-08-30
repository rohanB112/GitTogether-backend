const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rohan_112:Rohan2003@mycluster.bqr0j.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
