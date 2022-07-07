import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as userControllers from "../controllers/users.controllers.js";

const usersRouter = express.Router();

usersRouter.get("/accounts/profiles/:userId", nocache(), userControllers.getProfile);
usersRouter.get("/accounts/search", nocache(), userControllers.searchUser);

usersRouter.get("/friends/list", [nocache(), auth], userControllers.getFriends);
usersRouter.get("/friends/requests", [nocache(), auth], userControllers.getFriendRequests);

usersRouter.get("/leaderboard/global", [nocache(), auth], userControllers.getGlobalLeaderboard);
usersRouter.get("/leaderboard/friend", [nocache(), auth], userControllers.getFriendLeaderboard);
usersRouter.put("/leaderboard/subscribe-update", [nocache(), auth], userControllers.subscribeLeaderboardUpdate);

export default usersRouter;
