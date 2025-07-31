import mongoose from 'mongoose'

export type User = {
  _id: string
  name: string
  avatar?: string
  email: string
  isAdmin: boolean
}

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: false,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)

export default UserModel
