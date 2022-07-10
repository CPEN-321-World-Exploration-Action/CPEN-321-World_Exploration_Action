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
      //returns photo ID
      findPhotos(ID, method) {
        var photoList;

        // method: userID
        if (method === "userID") {
          photoList = this.find({ user_id: ID });
        } else if (method === "photoID") {
          photoList = this.find({ photo_id: ID }).exec();
        }

        return photoList;
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
        //wrong
        return this.aggregate([{ $sample: { size: limit } }]);
      },
      getSortedByTime(trophyID, limit) {
        return this.find({ trophy_id: trophyID })
          .sort({ time: -1 })
          .limit(limit)
          .select("imageUrl");
      },
      getSortedByLike(trophyID, limit) {
        return this.find({ trophy_id: trophyID })
          .sort({ like: -1 })
          .limit(limit)
          .select("imageUrl");
      },
      userLikePhoto: async function (userID, picID) {
        // issue: if pic not exist...
        /*
        let pic = this.findOne({ photo_id: picID });
        pic.likedUsers.push(userID);
        pic.like += 1;
        pic.save();
        */
        this.updateOne(
          { photo_id: picID },
          { $push: { likedUsers: userID } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
        let pic = await this.findOne({ photo_id: picID }).exec();
        this.updateOne(
          { photo_id: picID },
          {
            $set: {
              like: pic.like + 1,
            },
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
      },
      async userUnlikePhoto(userID, picID) {
        // check user liked photo before?
        let pic = await this.findOne({ photo_id: picID }).exec();

        /*
          pic.likedUsers = pic.likedUsers.filter(function (value, index, arr) {
            return value !== userID;
          });
          */
        // issue: referring to the same query?

        this.updateOne(
          { photo_id: picID },
          {
            $pullAll: {
              likedUsers: [userID, [userID]],
            },
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
        this.updateOne(
          { photo_id: picID },
          {
            $set: {
              like: pic.like - 1,
            },
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
        /*
          pic.like -= 1;
          pic.save();
          */
      },
    },
    methods: {},
  }
);

export const Photo = mongoose.model("Photo", photoSchema);
