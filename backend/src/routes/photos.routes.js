import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as photoControllers from "../controllers/photos.controllers.js";

const photosRouter = express.Router();

photosRouter.get("/photo/photoIDs", nocache(), photoControllers.getPhotoIDsByTrophyID);

export default photosRouter;
