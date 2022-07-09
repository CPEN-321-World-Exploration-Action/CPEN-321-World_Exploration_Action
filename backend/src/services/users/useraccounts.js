import messageManager from "../../utils/message-manager.js";
import { User } from "../../data/db/user.db.js";

export async function onReceiveTrophyCollectedMessage(collectorUserId, collectedTrophyId) {
  // TODO: Update UserDB
  messageManager.publishUserScoreUpdatedMessage(collectorUserId);
}

export async function getUserProfile(userId) {
  return await User.findUser(userId).exec();
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