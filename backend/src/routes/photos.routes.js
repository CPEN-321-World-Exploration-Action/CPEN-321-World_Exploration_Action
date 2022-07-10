import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import * as photoControllers from "../controllers/photos.controllers.js";

const photosRouter = express.Router();

photosRouter.put(
  "/photo/photoIDs",
  [nocache(), auth],
  photoControllers.userLikePhoto
);

/* Sorting */

photosRouter.get("/sorting/user/:userId", nocache(), photoControllers.getPhotoIDsByUserID);

/* Storing */
photosRouter.get(
  "/photo/photoIDs",
  [nocache(), auth],
  photoControllers.getImage
);

photosRouter.post("/storing/:trophyId/:userId", [auth, upload.single("photo")], photoControllers.uploadPhoto);
photosRouter.get("/storing/:photoId", photoControllers.getPhoto);

photosRouter.get("/sorting/photo-ids", nocache(), photoControllers.getPhotoIDsByTrophyID);


export default photosRouter;
