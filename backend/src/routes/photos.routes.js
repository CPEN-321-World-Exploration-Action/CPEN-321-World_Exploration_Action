import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import * as photoControllers from "../controllers/photos.controllers.js";

const photosRouter = express.Router();

/* Managing */

photosRouter.put("/managing/likes", [nocache(), auth], photoControllers.userLikePhoto); 

/* Sorting */

photosRouter.get("/sorting/user/:userId", nocache(), photoControllers.getPhotoIDsByUserID);
photosRouter.get("/sorting/photo-ids", [nocache(), auth], photoControllers.getPhotoIDsByTrophyID);

/* Storing */
photosRouter.post("/storing/:trophyId/:userId", [auth, upload.single("photo")], photoControllers.uploadPhoto); //Good
photosRouter.get("/storing/:photoId", photoControllers.getPhoto); //Good


export default photosRouter;
