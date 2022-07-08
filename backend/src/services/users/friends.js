import { User } from "../../data/db/user.db.js";
import "../../utils/utils.js";

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

export async function deleteFriend(userId, friendId) {
  await User.deleteFriend(userId, friendId);
  await User.deleteFriend(friendId, userId);
}

export async function acceptUser(userId, friendId) {
  removeRequest(friendId, userId);
  await User.mutuallyAddFriend(userId, friendId);
  // TODO: send notification
}

export async function declineUser(userId, friendId) {
  removeRequest(friendId, userId);
  // TODO: send notification
}

function removeRequest(source, target) {
  const existingRequests = friendRequests.get(target);
  if (existingRequests) {
    friendRequests.set(target, existingRequests.removed(source));
  }
}

