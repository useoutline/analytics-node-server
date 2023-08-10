import mongoose from 'mongoose'
import { randomUUID } from 'crypto'

const USER_MODEL_ERRORS = {
  EMAIL_REQUIRED: 'EMAIL_REQUIRED',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      required: [true, USER_MODEL_ERRORS.EMAIL_REQUIRED],
      unique: [true, USER_MODEL_ERRORS.EMAIL_ALREADY_EXISTS],
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const UserModel = mongoose.model('users', userSchema)

export default UserModel
