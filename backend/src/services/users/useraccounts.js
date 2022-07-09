import * as messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";

export async function onReceiveTrophyCollectedMessage(message) {
  // TODO: Test
  await User.incrementTrophyScore(message.userId, message.trophyScore);
  messageManager.publishNewMessage({
    type: "user_score_updated",
    userId: message.userId,
  });
}

export async function getUserProfile(userId) {
  return await User.findUser(userId);
}

export async function loginWithGoogle(idToken) {
  // issue: what is token
}

export async function extractGoogleID(idToken) {
  // issue: what is token
}

export async function createUserProfile(idToken) {
  // addUser(newUser)
  /*
  user_id: { type: String, index: true, unique: true },
    google_id: { type: String, index: true },
    name: { type: String, index: true },
    email: {
      type: String,
      lowercase: true,
      index: true,
    },
    imageUrl: String,
    friends: [String],
    score: { type: Number, default: 0, index: true },
    fcm_token: String,
    */
}

export async function getProfileImage(userID){
  // issue: said to be determined later..
}

// dev functions
export async function createUser(req, res){
  try{
    const user = await User.create(req.body)
    res.status(201).json({user})
  }catch (error){
    res.status(500).json({message: error})
  }
}

export async function getAllUsers(){
  return await User.find({});
}

export async function deleteUser(user_id){
  return await User.findOneAndDelete({user_id:user_id}, {})
}
export async function signOut(){
    // issue: should not be here?
}

export async function searchUser(query) {
  return await User.searchUser(query);
}