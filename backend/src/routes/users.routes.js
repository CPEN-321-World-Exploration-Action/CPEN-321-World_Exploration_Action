import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as userControllers from "../controllers/users.controllers.js";

const usersRouter = express.Router();

/* Accounts */
//usersRouter.post('/create', [nocache(), auth], userControllers.createProfile);
usersRouter.post('/accounts/login', userControllers.login);
usersRouter.post('/accounts/logout', auth, userControllers.logout);
usersRouter.put("/accounts/fcm-token/:fcmToken", auth, userControllers.uploadFcmToken);

usersRouter.get("/accounts/profiles/:userId", [nocache(), auth], userControllers.getProfile);
usersRouter.get("/accounts/search", nocache(), userControllers.searchUser);

/* Friends */
usersRouter.get("/friends/list", [nocache(), auth], userControllers.getFriends);
usersRouter.get("/friends/requests", [nocache(), auth], userControllers.getFriendRequests);
usersRouter.post("/friends/send-request", [nocache(), auth], userControllers.sendFriendRequest);
usersRouter.post("/friends/delete", [nocache(), auth], userControllers.deleteFriend);
usersRouter.post("/friends/accept-request", [nocache(), auth], userControllers.acceptFriendRequest);
usersRouter.post("/friends/decline-request", [nocache(), auth], userControllers.declineFriendRequest);

/* Leaderboard */
usersRouter.get("/leaderboard/global", [nocache(), auth], userControllers.getGlobalLeaderboard);
usersRouter.get("/leaderboard/friend", [nocache(), auth], userControllers.getFriendLeaderboard);
usersRouter.put("/leaderboard/subscribe-update", [nocache(), auth], userControllers.subscribeLeaderboardUpdate);

/* For Testing */
usersRouter.post('/accounts/tester-login', userControllers.testerLogin);

//dev
// usersRouter.post("/create", userControllers.createUser);
// usersRouter.get("/", userControllers.getAllUsers);
// usersRouter.delete("/:userID", userControllers.deleteUser);

export default usersRouter;
