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


// Dev functions
export async function createUser(req, res){
  // When creating a user, we also need to create a document in the TrophyUser DB

  // For some reason, trying to catch validation errors here doesn't work, so
  // createUser() handles returing res. 
  userAccounts.createUser(req, res)
}

export async function getAllUsers(req, res){
  try{
    const users = await userAccounts.getAllUsers()
    res.status(200).json({users})
  }catch (error){
    res.status(500).json({message: error})
  }
}

export async function deleteUser(req, res){

  // Also need to remove user from TrophyUser database

  const {userID: user_id} = req.params
  try{
    // Return deleted user for testing purposes
    const user = await userAccounts.deleteUser(user_id)
    if (!user){
      res.status(404).json({message: `User with id ${user_id} not found.`})
    }
    res.status(200).json({user})
  }catch (error){
    res.status(500).json({message:error})
  }
}