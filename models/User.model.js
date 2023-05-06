import mongoose from "mongoose";
import { randomUUID } from "crypto";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => randomUUID(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
