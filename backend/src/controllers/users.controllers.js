import * as userAccounts from "../services/users/useraccounts.js";
import * as leaderboard from "../services/users/leaderboard.js";
import * as friends from "../services/users/friends.js";

export async function getProfile(req, res) {
  const userId = req.params["userId"];
  const user = await userAccounts.getUserProfile(userId);
  if (user) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(404).json({
      message: "Could not find the user",
    });
  }
}

export async function createProfile(req, res){
  const userId = req.params['userId'];
  const user = await userAccounts.createUserProfile(userId);
  if (user){
    res.status(200).json({
      user,
    });
  }else{
    res.status(404).json({
      message: "Could not create user",
    })
  }
}

export async function getFriends(req, res) {
  const friends = await friends.retrieveFriends(req.userId);
  res.status(200).json({
    friends,
  });
}

export async function getGlobalLeaderboard(req, res) {
  const users = await leaderboard.getGlobalLeaderboard();
  res.status(200).json(users);
}

export async function getFriendLeaderboard(req, res) {
  const users = await leaderboard.getFriendLeaderboard(req.userId);
  res.status(200).json(users);
}

export async function subscribeLeaderboardUpdate(req, res) {
  const fcmToken = req.query.fcmToken;
  if (fcmToken) {
    const expireTime = await leaderboard.subscribeUpdate(req.userId, fcmToken);
    res.status(200).json({
      expireTime,
    });
  } else {
    res.status(400).json({
      message: "Missing parameter: fcmToken",
    });
  }
}
