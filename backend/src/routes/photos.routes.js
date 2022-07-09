import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as photoControllers from "../controllers/photos.controllers.js";

const photosRouter = express.Router();

/* Managing */
photosRouter.put(
  "/photo/photoIDs",
  [nocache(), auth],
  photoControllers.userLikePhoto
);

/* Sorting */
photosRouter.post(
  "/photo/photoIDs",
  [nocache(), auth],
  photoControllers.getPhotoIDsByTrophyID
);
photosRouter.post(
  "/photo/photoIDs",
  [nocache(), auth],
  photoControllers.getPhotoIDsByUserID
);

/* Storing */
photosRouter.get(
  "/photo/photoIDs",
  [nocache(), auth],
  photoControllers.uploadPhoto
);
photosRouter.post(
  "/photo/photoIDs",
  [nocache(), auth],
  photoControllers.getImage
);

export default photosRouter;
