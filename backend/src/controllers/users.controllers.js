import * as userAccounts from "../services/users/useraccounts.js";
import * as leaderboard from "../services/users/leaderboard.js";
import * as friends from "../services/users/friends.js";

export async function login(req, res){
  // After auth middleware, we have a session with userId. 
  // Now we check if the user exists.
  // If a user doesnt exist we can use the token payload to create a new User - however we also need user lat and lon. So we must ensure that is in the post request.
  // After, we setup a session for the user.

  const userId = req.session.userId
  req.session.save()

  try{
    let user = await userAccounts.getUserProfile(userId)

    if (!user){
      req.payload.user_id = userId // Add to payload so payload can be used to create profile with one object
      console.log(`User does not exist. Creating User with id: ${userId}`)
      user = await userAccounts.createUserProfile(req.payload)
      //Using newly created account, we also need to create a TrophyUser document

    }

    res.status(201).json({user})
  } catch (error){
    res.status(500).json({message: error})
  }
}

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
  console.log(user)
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
  await friends.sendRequest(req.userId, targetId);
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
  await friends.deleteFriend(req.userId, friendId);
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
  await friends.acceptUser(req.userId, requesterId);
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
  await friends.declineUser(req.userId, requesterId);
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