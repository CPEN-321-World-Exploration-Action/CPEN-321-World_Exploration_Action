import * as userAccounts from "../services/users/useraccounts.js";
import * as leaderboard from "../services/users/leaderboard.js";
import * as friends from "../services/users/friends.js";

/*** Accounts ***/

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

export async function searchUser(req, res) {
  const query = req.query.query;
  if (query) {
    const result = await userAccounts.searchUser(query);
    res.status(200).json(result);
  } else {
    res.status(400).json({
      message: "Missing or invalid query",
    });
  }
}

/*** Friends ***/

export async function getFriends(req, res) {
  const friendProfiles = await friends.retrieveFriends(req.userId);
  res.status(200).json(friendProfiles);
}

export async function getFriendRequests(req, res) {
  const requestorProfiles = await friends.getFriendRequests(req.userId);
  res.status(200).json(requestorProfiles);
}

export async function sendFriendRequest(req, res) {
  const targetId = req.query.targetUserId;
  if (!targetId) {
    res.status(400).json({
      message: "Missing query parameter: targetId",
    });
    return;
  }
  friends.sendRequest(req.userId, targetId);
  res.status(200).send();
}

export async function deleteFriend(req, res) {
  const friendId = req.query.friendId;
  if (!friendId) {
    res.status(400).json({
      message: "Missing query parameter: friendId",
    });
    return;
  }
  friends.deleteFriend(req.userId, friendId);
  res.status(200).send();
}

export async function acceptFriendRequest(req, res) {
  const requesterId = req.query.requesterUserId;
  if (!requesterId) {
    res.status(400).json({
      message: "Missing query parameter: requesterUserId",
    });
    return;
  }
  friends.acceptUser(req.userId, requesterId);
  res.status(200).send();
}

export async function declineFriendRequest(req, res) {
  const requesterId = req.query.requesterUserId;
  if (!requesterId) {
    res.status(400).json({
      message: "Missing query parameter: requesterUserId",
    });
    return;
  }
  friends.declineUser(req.userId, requesterId);
  res.status(200).send();
}

/*** Leaderboard ***/

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
      message: "Missing query parameter: fcmToken",
    });
  }
}
