import mongoose from "mongoose";

const { Schema } = mongoose;

const trophySchemaTrophy = new Schema(
  {
    trophy_id: { type: String, index: true, unique: true },
    name: { type: String },
    latitude: { type: Number, required: [true, "Trophy must have Latitude"] },
    longitude: { type: Number, required: [true, "Trophy must have Longitude"] },
    number_of_collectors: { type: Number, default: 0 },
    quality: {
      type: String,
      enum: ["Gold", "gold", "Silver", "silver", "Bronze", "bronze"],
      default: "Bronze",
    },
    list_of_photos: { type: Array, default: [] },
    list_of_collectors: { type: Array, default: [] },
  },
  {
    statics: {
      async incrementNumberOfCollector(trophyID, userID) {
        let trophy = await this.findOne({ trophy_id: trophyID }).exec();
        trophy.number_of_collectors += 1;
        trophy.save();

        const addToSet = { list_of_collectors: userID };
        await this.updateOne(
          { trophy_id: trophyID },
          { $addToSet: addToSet }
        );
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

    uncollectedTrophies: { type: Array, default: [] },
    collectedTrophies: { type: Array, default: [] },
    list_of_photos: { type: Array, default: [] },
    trophyTags: { type: Array, default: [] },
  },
  {
    statics: {
      async addUncollectedTrophies(userId, trophyIds) {
        const addToSet = { $each: trophyIds };
        const update = {
          $addToSet: { uncollectedTrophies: addToSet },
        };
        const res = await this.updateOne({ user_id: userId }, update);
        return res.modifiedCount > 0;
      },
      async removeUncollectedTrophy(userId, trophyId) {
        const update = { $pullAll: { uncollectedTrophies: [trophyId] } };
        const res = await this.updateOne(
          { user_id: userId },
          update
        );

        return res.modifiedCount > 0;
      },
      async addCollectedTrophy(userId, trophyId) {
        const addToSet = { collectedTrophies: trophyId };
        const update = { $addToSet: addToSet };
        const res = await this.updateOne(
          { user_id: userId },
          update
        );
        return res.modifiedCount > 0;
      },
      async findOrCreate(userID) {
        let user = await this.findOne({ user_id: userID }).exec();
        if (!user) {
          user = await this.create({ user_id: userID });
        }
        return user;
      },
      async getUserUncollectedTrophyIDs(userID) {
        const user = await this.findOrCreate(userID);
        return user.uncollectedTrophies;
      },
      async getUserCollectedTrophyIDs(userID) {
        const user = await this.findOrCreate(userID);
        return user.collectedTrophies;
      },
    },
    methods: {},
  }
);

export const TrophyUser = mongoose.model("TrophyUser", trophySchemaUser);
export const TrophyTrophy = mongoose.model("TrophyTrophy", trophySchemaTrophy);
