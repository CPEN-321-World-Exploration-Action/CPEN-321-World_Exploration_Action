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
      updateFcmToken(userId, fcmToken) {
        return this.updateOne({ user_id: userId }, { fcm_token: fcmToken }).exec();
      },
      findUser(userId) {
        return this.findOne({ user_id: userId }).exec();
      },
      findUsers(userIds) {
        return this.find({ user_id: { $in: userIds } }).exec();
      },
      findTopUsers(limit) {
        return this.find().sort({ score: -1 }).limit(limit);
      },
      async computeUserRank(userId) {
        const user = await this.findUser(userId);
        const gtCount = await this.count({ score: { $gt: user.score } }).count();
        return gtCount + 1;
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
        const update1 = { $push: { friends: user2Id } };
        await this.updateOne(
          { user_id: user1Id },
          update1
        ).exec();
        const update2 = { $push: { friends: user1Id } };
        await this.updateOne(
          { user_id: user2Id },
          update2
        ).exec();
      },
      async mutuallyDeleteFriend(user1Id, user2Id) {
        const update1 = { $pullAll: { friends: [user2Id] } };
        const result1 = await this.updateOne(
          { user_id: user1Id },
          update1
        );
        const update2 = { $pullAll: { friends: [user1Id] } };
        const result2 = await this.updateOne(
          { user_id: user2Id },
          update2
        );
        return result1.modifiedCount > 0 || result2.modifiedCount > 0;
      },
    },
    methods: {},
  }
);

export const User = mongoose.model("User", userSchema);