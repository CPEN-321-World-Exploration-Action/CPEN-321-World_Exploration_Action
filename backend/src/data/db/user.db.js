import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user_id: { type: String, index: true, unique: true, required:true },
    user_latitude: {type: Number},
    user_longitude: {type: Number},
    //google_id: { type: String, index: true },
    name: { type: String, index: true },
    email: {
      type: String,
      lowercase: true,
      index: true,
    },
    picture: String,
    friends: { type: [String], default: [] },
    score: { type: Number, default: 0, index: true },
    fcm_token: String,
  },
  {
    statics: {
      addUser(userId) {
        return this.create({user_id: userId});
      },
      findUser(userId) {
        return this.findOne({ user_id: userId }).exec();
      },
      addUser(newUser) {
        // issue: user_id == google_id
        this.collection.insertOne(newUser);
      },
      findUsers(userIds) {
        return this.find({ user_id: { $in: userIds } }).exec();
      },
      findTopUsers(limit) {
        return this.find().sort({ score: -1 }).limit(limit);
      },
      computeUserRank(userID) {
        var user = this.findOne({ user_id: userID });
        return this.find({ score: { $gt: user.score } }).count();
      },
      async incrementTrophyScore(userId, score) {
        const user = await this.findUser(userId);
        user.score += score;
        await user.save();
      },
      searchUser(query) {
        return this.find({
          $or: [
            { user_id: query },
            { email: query },
            { name: { $regex: query, $options: "i" } },
          ],
        }).exec();
      },
      async getFriends(userId) {
        const user = await this.findOne({ user_id: userId }).exec();
        return this.find({ user_id: { $in: user.friends } }).exec();
      },
      async mutuallyAddFriend(user1Id, user2Id) {
        await this.updateOne(
          { user_id: user1Id },
          { $push: { friends: user2Id } }
        ).exec();
        await this.updateOne(
          { user_id: user2Id },
          { $push: { friends: user1Id } }
        ).exec();
      },
      deleteFriend(userId, friendId) {
        return this.updateOne(
          { user_id: userId },
          { $pull: { friends: friendId } }
        ).exec();
      },
    },
    methods: {},
  }
);

export const User = mongoose.model("User", userSchema);