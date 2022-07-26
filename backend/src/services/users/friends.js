import { User } from "../../data/db/user.db.js";
import * as fcm from "../../data/external/fcm.external.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { elementRemoved } from "../../utils/utils.js";

const friendRequests = new Map();

export async function retrieveFriends(userId) {
  const user = await User.findUser(userId);
  if (!user){
    throw new NotFoundError("Cannot find the user");
  }
  return await User.getFriends(userId);
}

export async function getFriendRequests(userId) {
  const user = await User.findUser(userId);
  if (!user) {
    throw new NotFoundError("Cannot find the user");
  }

  const requestors = friendRequests.get(userId);
  if (requestors) {
    return await User.findUsers(requestors);
  } else {
    return [];
  }
}

export async function sendRequest(senderId, targetId) {
  const sender = await User.findUser(senderId);
  const target = await User.findUser(targetId);
  if (!sender) {
    throw new NotFoundError("Cannot find the sending user");
  }
  if (!target) {
    throw new NotFoundError("Cannot find the target user");
  }

  const existingRequests = friendRequests.get(targetId) ?? [];
  if (!existingRequests.includes(senderId)) {
    existingRequests.push(senderId);
  }
  friendRequests.set(targetId, existingRequests);

  sendNotificationInBackground(
    targetId,
    "New Friend Request",
    sender.name + " sent you a friend request"
  );
}

export async function deleteFriend(userId, friendId) {
  const result = await User.mutuallyDeleteFriend(userId, friendId);
  if (!result) {
    throw new BadRequestError("They are not friends.");
  }
}

export async function acceptUser(userId, friendId) {
  removeRequest(friendId, userId); // this will make sure userId and friendId are valid
  await User.mutuallyAddFriend(userId, friendId);

  const acceptor = await User.findUser(userId);
  sendNotificationInBackground(
    friendId,
    "Accepted Friend Request",
    acceptor.name + " accepted your friend request"
  );
}

export async function declineUser(userId, friendId) {
  removeRequest(friendId, userId);// this will make sure userId and friendId are valid

  const user = await User.findUser(userId);
  sendNotificationInBackground(
    friendId,
    "Declined Friend Request",
    user.name + " declined your friend request"
  );
}

function removeRequest(source, target) {
  const existingRequests = friendRequests.get(target);
  if (!existingRequests || !existingRequests.includes(source)) {
    throw new NotFoundError("Cannot find the friend request");
  }
  friendRequests.set(target, elementRemoved(existingRequests, source));
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
