import mongoose from "mongoose";

const { Schema } = mongoose;

const trophySchemaTrophy = new Schema(
  {
      trophy_id: { type: String, index: true, unique: true },
      number_of_collectors: { type: Number, default: 0},
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
        incrementNumberOfCollector(trophyId){
          this.findOne(trophyId).number_of_collectors += 1; // initialized to be 0
        },
    },
    methods: {

    },
  }
);

const trophySchemaUser = new Schema(
    {
        user_id: { type: String, index: true, unique: true },
        uncollectedTrophies: { type: Array, default: []},

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
          removeUncollectedTrophy(userId, trophyId){
              var user = this.findOne(userId);
              user.uncollectedTrophies = user.uncollectedTrophies.filter(function(value, index, arr){
                  return value !== trophyId;
              });
              user.save();
          },
          addCollectedTrophy(userId, trophyId){
              var user = this.find(userId);
              user.collectedTrophies = user.collectedTrophies.push(trophyId).sort();
              user.save();
          },


      },
      methods: {

      },
    }
);

export const TrophyUser = mongoose.model("TrophyUser", trophySchemaUser);
export const TrophyTrophy = mongoose.model("TrophyTrophy", trophySchemaTrophy);