// const mongoose = require("mongoose");
import mongoose, { model } from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  inAppName: {
    type: String,
    required: true,
    unique: true,
  },
});

// module.exports = mongoose.model("User", userSchema);
export default model("User", userSchema);
