import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as userControllers from "../controllers/users.controllers.js";

const usersRouter = express.Router();

usersRouter.get("/:userId/profile", nocache, userControllers.getProfile);
usersRouter.get("/:userId/friends", [nocache, auth], userControllers.getFriends);

export default usersRouter;
