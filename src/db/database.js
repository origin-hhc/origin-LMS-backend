const mongoose = require("mongoose");
require("dotenv").config();

const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Could not connect to the database", error);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB;
