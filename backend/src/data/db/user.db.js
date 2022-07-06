import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user_id: { type: String, index: true, unique: true },
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
      addUser(newUser){
        // issue: user_id == google_id
        this.collection.insertOne(newUser);
      },
      findTopUsers(limit) {
        return this.find().sort({ score: -1 }).limit(limit);
      },
      computeUserRank(String userID){

        user = this.findOne({ user_id: userID });
        return this.find({score: { $gt : user["score"] }}).count();

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
