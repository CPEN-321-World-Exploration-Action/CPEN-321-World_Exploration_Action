import { User } from "../../data/db/user.db.js";

const friendRequests = new Map();

export async function retrieveFriends(userId) {
  return await User.getFriends(userId);
}

export async function getFriendRequests(userId) {
  const requestors = friendRequests.get(userId);
  if (requestors) {
    return await User.findUsers(requestors);
  } else {
    return [];
  }
}

export async function sendRequest(userId, targetId) {
  const existingRequests = friendRequests.get(targetId) ?? [];
  if (!existingRequests.includes(userId)) {
    existingRequests.push(userId);
  }
  friendRequests.set(targetId, existingRequests);
  // TODO: send notification
}

