import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as userControllers from "../controllers/users.controllers.js";

const usersRouter = express.Router();

//usersRouter.post('/create', [nocache(), auth], userControllers.createProfile);
usersRouter.post('/login', auth, userControllers.login);
usersRouter.get("/:userId/profile", [nocache(), auth], userControllers.getProfile);

usersRouter.put("/leaderboard/subscribe-update", [nocache(), auth], userControllers.subscribeLeaderboardUpdate);
usersRouter.get("/leaderboard/global", [nocache(), auth], userControllers.getGlobalLeaderboard);
usersRouter.get("/leaderboard/friend", [nocache(), auth], userControllers.getFriendLeaderboard);

//dev
usersRouter.post("/create", userControllers.createUser);
usersRouter.get("/", userControllers.getAllUsers);
usersRouter.delete("/:userID", userControllers.deleteUser);

export default usersRouter;
