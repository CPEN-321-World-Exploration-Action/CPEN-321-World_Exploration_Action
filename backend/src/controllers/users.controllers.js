import * as userAccounts from "../services/users/useraccounts.js";
import * as trophyControllers from "../controllers/trophies.controllers.js";
import * as leaderboard from "../services/users/leaderboard.js";
import * as friends from "../services/users/friends.js";

export async function login(req, res){
  // After auth middleware, we have a session with userId. 
  const user_id = req.session.userId
  req.params.user_id = user_id // Required to interface with trophyControllers.
  req.session.save()

  try{
    let user = await userAccounts.getUserProfile(user_id)
    // let trophyUser = await trophyDetail.getTrophyUser(userId) 
    let trophyUser = await trophyControllers.getTrophyUser(req, res)
    console.log(trophyUser)
    if (!user){
      req.payload.user_id = user_id // Add to payload so payload can be used to create profile with one object
      console.log(`User does not exist. Creating User with id: ${user_id}`)
      user = await userAccounts.createUserProfile(req.payload)
      //Using newly created account, we also need to create a TrophyUser document
      trophyUser = await trophyControllers.createTrophyUser(req, res)
    }
    if (!trophyUser){
      // If user!=null then trophyUser should never be null either unless table has been dropped.
      console.log(`User with id ${user_id} exists in the user database but not in the Trophy database. Creating New Entry`)
      trophyUser = await trophyControllers.createTrophyUser(req, res)
      // return res.status(500).json({message:`User with id ${user_id} exists in the user database but not in the Trophy database`})
    }
    res.status(201).json(user.user_id)
  } catch (error){
    console.log(error)
    res.status(500).json({message: error})
  }
}

export async function logout(req, res){
  const userId = req.userId;
  if (req.session.userId){
    req.session.destroy();
  }
  await userAccounts.signOut(userId);
  res.status(200).json({message: "Logged Out."})
}

export async function uploadFcmToken(req, res) {
  const fcmToken = req.params.fcmToken;
  await userAccounts.uploadFcmToken(req.userId, fcmToken);
  res.status(200).send();
}

export async function getProfile(req, res) {
  const userId = req.params.userId;
  const user = await userAccounts.getUserProfile(userId);
  if (user) {
    res.status(200).json(user);
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

  const { userID: user_id } = req.params;
  try{
    // Return deleted user for testing purposes
    const user = await userAccounts.deleteUser(user_id)
    if (!user){
      return res.status(404).json({message: `User with id ${user_id} not found.`})
    }
    // Also need to remove user from TrophyUser database
    const trophyUser = await trophyDetail.deleteTrophyUser(user_id)
    if (!trophyUser){
      return res.status(404).json({message: `TrophyUser with id ${user_id} not found.`})
    }

    // Regenerate session to wipe userId
    req.session.regenerate(function(err){if (err){console.log(err)}})

    res.status(200).json({user, trophyUser})
  }catch (error){
    res.status(500).json({message:error})
  }
}