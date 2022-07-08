import mongoose from "mongoose";

const { Schema } = mongoose; 

const photoSchema = new Schema(
  {
    photo_id: { type: String, index: true, unique: true },
    like: { type: Number, index: true, default: 0 },
    user_id: { type: String, index: true },
    trophy_id: { type: String, index: true },
    //google_id: { type: String, index: true },
    imageUrl: { type: String }, //issue we use imageData?
    time: { type: Date, default: new Date().getTime(), index: true },
    likedUsers: { type: Array, default: [null] },
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
          photoList = this.find({ photo_id: ID });
        }

        return photoList;
      },
      addPhoto(photo) {
        this.collection.insertOne(photo);
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
        this.upadateOne(
          { photo_id: picID },
          { $push: { likedUsers: [userID] } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
      },
      userUnlikePhoto(userID, picID) {
        // check user liked photo before?
        let pic = this.findOne({ photo_id: picID });
        if (userID in pic.likedUsers) {
          pic.likedUsers = pic.likedUsers.filter(function (value, index, arr) {
            return value !== userID;
          });
          pic.like -= 1;
          pic.save();
        }
      },
    },
    methods: {},
  }
);

export const Photo = mongoose.model("Photo", photoSchema);

var test = {
  photo_id: "1",
  user_id: "0",
  google_id: "1",
  imageUrl: "1", //issue we use imageData?
};

/*
Photo.getRandom("asd", 10);
Photo.getSortedByTime("asd", 10);
Photo.getSortedByLike("asd", 10);
Photo.userLikePhoto("as", "as");
Photo.userUnlikePhoto("userID", "picID");

Photo.addPhoto(new Photo({
    photo_id: "7",
    trophy_id: "2",
    user_id: "2",
    imageURL: "@"
}));
*/
