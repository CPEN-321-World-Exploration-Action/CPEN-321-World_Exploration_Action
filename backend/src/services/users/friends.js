import { User } from "../../data/db/user.db.js";
import * as fcm from "../../data/external/fcm.external.js";
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

export async function sendRequest(senderId, targetId) {
  const existingRequests = friendRequests.get(targetId) ?? [];
  if (!existingRequests.includes(senderId)) {
    existingRequests.push(senderId);
  }
  friendRequests.set(targetId, existingRequests);

  const sender = await User.findUser(senderId);
  sendNotificationInBackground(
    targetId,
    "New Friend Request",
    sender.name + " sent you a friend request"
  );
}

export async function deleteFriend(userId, friendId) {
  await User.deleteFriend(userId, friendId);
  await User.deleteFriend(friendId, userId);
}

export async function acceptUser(userId, friendId) {
  removeRequest(friendId, userId);
  await User.mutuallyAddFriend(userId, friendId);

  const acceptor = await User.findUser(userId);
  sendNotificationInBackground(
    friendId,
    "Accepted Friend Request",
    acceptor.name + " accepted your friend request"
  );
}

export async function declineUser(userId, friendId) {
  removeRequest(friendId, userId);

  const user = await User.findUser(userId);
  sendNotificationInBackground(
    friendId,
    "Declined Friend Request",
    user.name + " declined your friend request"
  );
}

function removeRequest(source, target) {
  const existingRequests = friendRequests.get(target);
  if (existingRequests) {
    friendRequests.set(target, existingRequests.removed(source));
  }
}

function sendNotificationInBackground(targetUserId, title, body) {
  (async () => {
    const targetUser = await User.findUser(targetUserId);
    if (!targetUser.fcm_token) {
      console.log("User %s does not have an fcm_token", targetUserId);
      return;
    }
    await fcm.sendFriendNotification(targetUser.fcm_token, title, body);
  })().catch((err) => {
    console.log(err);
  });
}
