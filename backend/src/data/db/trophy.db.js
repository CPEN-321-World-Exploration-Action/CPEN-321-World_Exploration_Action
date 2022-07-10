import mongoose from "mongoose";

const { Schema } = mongoose;

const trophySchemaTrophy = new Schema(
  {
    trophy_id: { type: String, index: true, unique: true },
    latitude: { type: Number, required: [true, "Trophy must have Latitude"] },
    longitude: { type: Number, required: [true, "Trophy must have Longitude"] },
    number_of_collectors: { type: Number, default: 0 },
    quality: {
      type: String,
      enum: ["Gold", "gold", "Silver", "silver", "Bronze", "bronze"],
      default: "Bronze",
    },
    list_of_photos: { type: Array, default: [" "] },
    list_of_collectors: { type: Array, default: [" "] },
    /*
    photo_id: { type: String, index: true, unique: true },
    number_of_likes: { type: Number, index: true },
    user_id: { type: String, index: true },
    google_id: { type: String, index: true },
    imageUrl: String, //issue we use imageData?
       */
  },
  {
    statics: {
      async incrementNumberOfCollector(trophyID, userID) {
        let trophy = await this.findOne({ trophy_id: trophyID }).exec();
        if (trophy.number_of_collectors == null){
          trophy.number_of_collectors = 1;
        }
        else{
          trophy.number_of_collectors += 1; // initialized to be 0
        }
        trophy.save();

        this.updateOne(
          { trophy_id: trophyID },
          { $push: { list_of_collectors: userID } },
          function (error, success) {
            if (error) {
              console.log(error);
            }
          }
        );
      },
      async getTrophyText(id) {
        var trophyInfo = await this.findOne({ trophy_id: id }).exec();
        delete trophyInfo.list_of_photos;
        return trophyInfo;
      },
      async addUserToTrophy(userID, trophyID) {
        var trophy = await this.findOne({ trophy_id: trophyID }).exec();
        trophy.list_of_collectors.push(userID).sort();
        trophy.save();
      },
      async getTrophyScore(collectedTrophyId) {
        var trophy = await this.findOne({
          trophy_id: collectedTrophyId,
        }).exec();
        // issue: score value?
        let quality = trophy.quality;

        if (quality == "Gold" || quality == "gold") {
          return 10;
        } else if (quality == "Silver" || quality == "silver") {
          return 5;
        } else {
          return 1;
        }
      },
    },
    methods: {},
  }
);

const trophySchemaUser = new Schema(
  {
    user_id: { type: String, index: true, unique: true },

    uncollectedTrophies: { type: Array, default: [" "] },
    collectedTrophies: { type: Array, default: [" "] },
    list_of_photos: { type: Array, default: [" "] },
    trophyTags: { type: Array, default: [" "] }, //issue: assign a space for testing
    /*
    photo_id: { type: String, index: true, unique: true },
    number_of_likes: { type: Number, index: true },
    user_id: { type: String, index: true },
    google_id: { type: String, index: true },
    imageUrl: String, //issue we use imageData?
       */
  },
  {
    statics: {
      async removeUncollectedTrophy(userId, trophyId) {
        /*
        var user = await this.findOne({ user_id: userId }).exec();
        user.uncollectedTrophies = user.uncollectedTrophies.filter(function (
          value,
          index,
          arr
        ) {
          return value !== trophyId;
        });
        user.save();
        */
        this.updateOne(
          { user_id: userId },
          {
            $pullAll: {
              uncollectedTrophies: [trophyId, [trophyId]],
            },
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
            }
          }
        );
      },
      async addCollectedTrophy(userId, trophyId) {
        /*
        var user = await this.findOne({ user_id: userId }).exec();
        user.collectedTrophies.push(trophyId);
        user.save();
        */
        this.updateOne(
          { user_id: userId },
          { $push: { collectedTrophies: trophyId } },
          function (error, success) {
            if (error) {
              console.log(error);
            }
          }
        );
      },
      async storeTrophies(userID, trophies) {
        var user = await this.findOne({ user_id: userID }).exec();
        for (let value of trophies) {
          user.collectedTrophies.push(value);
        }
        user.save();
      },
      async getUsersTags(userID) {
        return await this.findOne({ user_id: userID }).exec().trophyTags;
      },
      async getUserUncollectedTrophyIDs(userID) {
        return await this.findOne({ user_id: userID }).exec()
          .uncollectedTrophies;
      },
    },
    methods: {},
  }
);

export const TrophyUser = mongoose.model("TrophyUser", trophySchemaUser);
export const TrophyTrophy = mongoose.model("TrophyTrophy", trophySchemaTrophy);
