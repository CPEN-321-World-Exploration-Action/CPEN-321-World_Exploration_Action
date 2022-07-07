import { User } from "../../data/db/user.db.js";

const friendRequests = new Map();

export async function retrieveFriends(userId) {
  const user = await User.findUser(userId).exec();
  return await user.getFriends().exec();
}

export async function getFriendRequests(userId) {
  const requestors = friendRequests.get(userId)
  if (requestors) {
    return await User.findUsers(requestors);
  } else {
    return [];
  }
}

