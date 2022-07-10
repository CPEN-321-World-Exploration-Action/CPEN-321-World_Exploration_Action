import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import * as photoControllers from "../controllers/photos.controllers.js";

const photosRouter = express.Router();

/* Managing */

photosRouter.put("/managing/likes", [nocache(), auth], photoControllers.userLikePhoto); 

/* Sorting */

photosRouter.get("/sorting/photoIDs", [nocache(), auth], photoControllers.getPhotoIDsByUserID); //good

/* Storing */
photosRouter.get("/photo/photoIDs", [nocache(), auth], photoControllers.getImage); // not going to use?

photosRouter.post("/storing/:trophyId/:userId", [auth, upload.single("photo")], photoControllers.uploadPhoto); //Good
photosRouter.get("/storing/:photoId", photoControllers.getPhoto); //Good

photosRouter.get("/sorting/photo-ids", nocache(), photoControllers.getPhotoIDsByTrophyID);


export default photosRouter;
