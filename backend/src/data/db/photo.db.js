import mongoose from "mongoose";

const { Schema } = mongoose;

const photoSchema = new Schema(
  {
    photo_id: { type: String, index: true, unique: true },
    like: { type: Number, index: true, default: 0 },
    user_id: { type: String, index: true },
    trophy_id: { type: String, index: true },
    time: { type: Date, index: true },
    likedUsers: { type: Array, default: [" "] },
  },
  {
    statics: {
      getPhotosByUser(userId) {
        return this.find({ user_id: userId }).sort({ time: -1 }).exec();
      },
      findPhoto(photoId) {
        return this.findOne({ photo_id: photoId }).exec();
      },
      addOrReplacePhoto(photoId, trophyId, userId) {
        return this.findOneAndUpdate(
          {
            user_id: userId,
            trophy_id: trophyId,
          },
          {
            photo_id: photoId,
            like: 0,
            time: new Date().getTime(),
            likedUsers: [],
          },
          { upsert: true }
        ).exec();
      },
      getRandom(trophyID, limit) {
        return this.aggregate([
          { $match: { trophy_id: trophyID } },
          { $sample: { size: limit } },
        ]).exec();
      },
      getSortedByTime(trophyID, limit) {
        return this.find({ trophy_id: trophyID })
          .sort({ time: -1 })
          .limit(limit)
          .select("photo_id");
      },
      getSortedByLike(trophyID, limit) {
        return this.find({ trophy_id: trophyID })
          .sort({ like: -1 })
          .limit(limit)
          .select("photo_id");
      },
      userLikePhoto(userID, picID) {
        return this.updateOne(
          { photo_id: picID },
          { $addToSet: { likedUsers: userID }, $inc: { like: 1 } }
        ).exec();
      },
      userUnlikePhoto(userID, picID) {
        return this.updateOne(
          { photo_id: picID },
          { $pullAll: { likedUsers: [userID] }, $inc: { like: -1 } }
        ).exec();
      },
    },
    methods: {},
  }
);

export const Photo = mongoose.model("Photo", photoSchema);

//Photo.getRandom("1", 5);
