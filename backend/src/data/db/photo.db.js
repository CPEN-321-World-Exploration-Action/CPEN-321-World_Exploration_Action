import mongoose from "mongoose";

const { Schema } = mongoose;

const photoSchema = new Schema(
    {
        photo_id: { type: String, index: true, unique: true },
        like: { type: Number, index: true, default: 0 },
        user_id: { type: String, index: true },
        google_id: { type: String, index: true },
        imageUrl: String, //issue we use imageData?
        time: {type: Date, default: new Date().getTime(), index: true},
        likedUsers: {type: Array, default: []}
    },
  {
    statics: {
        //returns photo ID
        findPhotos(userId, method) {

            var photoList;

            // method: userID
            if (method === "userID"){
                photoList = this.find({ user_id: userId });
            }

            return photoList;
        },
        getRandom(limit){

        },
        getSortedByTime(limit){
            return (this.find().sort({ time: -1 }).limit(limit)).imageUrl;
        },
        getSortedByLike(limit){
            return (this.find().sort({ like: -1 }).limit(limit)).imageUrl;
        },
        userLikePhoto(userID, picID){
            // issue: if pic not exist...
            let pic = this.findOne({photo_id: picID});
            pic.likedUsers.push(userID);
            pic.like += 1;
            pic.save();
        },
        userUnlikePhoto(userID, picID){
            // check user liked photo before?
            let pic = this.findOne({photo_id: picID});
            if (userID in pic.likedUsers){
                pic.likedUsers = pic.likedUsers.filter(function(value, index, arr){
                    return value !== userID;
                });
                pic.like -= 1;
                pic.save()
            }
        },

    },
    methods: {

    },
  }
);

export const Photo = mongoose.model("Photo", photoSchema);