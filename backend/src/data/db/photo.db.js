import mongoose from "mongoose";

const { Schema } = mongoose;

const photoSchema = new Schema(
  {
    photo_id: { type: String, index: true, unique: true },
    number_of_likes: { type: Number, index: true },
    user_id: { type: String, index: true },
    google_id: { type: String, index: true },
    imageUrl: String, //issue we use imageData?
  },
  {
    statics: {
        //returns photo ID
      findPhotos(userId, method) {

        var photoList;

        if (method == "userID"){
            photoList = this.find({ user_id: userId });
        }

        return photoList;
      },
    },
    methods: {

    },
  }
);

export const Photo = mongoose.model("Photo", photoSchema);