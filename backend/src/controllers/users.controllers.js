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
  const userId = req.params["userId"];
  const frineds = await friends.retrieveFriends(userId);
  res.status(200).json({
    frineds,
  });
}
