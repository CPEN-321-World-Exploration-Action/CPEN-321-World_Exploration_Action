import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as userControllers from "../controllers/users.controllers.js";

const usersRouter = express.Router();

usersRouter.get("/me/friends", [nocache(), auth], userControllers.getFriends);
usersRouter.get("/:userId/profile", nocache(), userControllers.getProfile);

usersRouter.get("/leaderboard/global", [nocache(), auth], userControllers.getGlobalLeaderboard);
usersRouter.get("/leaderboard/friend", [nocache(), auth], userControllers.getFriendLeaderboard);

export default usersRouter;
