import mongoose, { model } from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

// 채팅방 스키마
const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
    ref: "User",
  },
  participants: Array,
  password: String,
  chats: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Room", roomSchema);
