import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user_id: { type: String, index: true },
    google_id: { type: String, index: true },
    name: { type: String, index: true },
    email: {
      type: String,
      lowercase: true,
      index: true,
    },
    friends: [String],
  },
  {
    statics: {
      findUser(userId) {
        return this.findOne({ user_id: userId });
      },
    },
    methods: {
      getFriends() {
        return User.find().where("user_id").in(this.friends);
      },
    },
  }
);

export const User = mongoose.model("User", userSchema);
