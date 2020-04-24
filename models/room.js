const mongoose = require("mongoose");

const Schema = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
  },
  host: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  participants: {
    type: Array,
  },
  password: String,
  chats: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
