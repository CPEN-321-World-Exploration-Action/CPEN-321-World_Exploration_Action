import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user_id: { type: String, index: true, unique: true },
    user_latitude: {type: Number, required:true},
    user_longitude: {type: Number, required:true},
    google_id: { type: String, index: true },
    name: { type: String, index: true },
    email: {
      type: String,
      lowercase: true,
      index: true,
    },
    imageUrl: String,
    friends: [String],
    score: { type: Number, default: 0, index: true },
    fcm_token: String,
  },
  {
    statics: {
      findUser(userId) {
        return this.findOne({ user_id: userId });
      },
      findTopUsers(limit) {
        return this.find().sort({ score: -1 }).limit(limit);
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
