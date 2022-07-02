import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    google_id: { type: String, index: true },
    name: { type: String, index: true },
    email: {
      type: String,
      lowercase: true,
      index: true,
    },
    friends: [Schema.Types.ObjectId],
  },
  {
    statics: {},
    methods: {
      getFriends() {
        return this.find().where("_id").in(this.friends);
      },
    },
  }
);

export const User = mongoose.model("User", userSchema);
