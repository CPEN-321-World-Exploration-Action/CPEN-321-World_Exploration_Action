import { User } from "../../data/db/user.db.js";
import * as fcm from "../../data/external/fcm.external.js";

let subscribers = new Map();
const validDuration = 1000 * 60 * 60; /* 1 hour */

/* Clean up expired subscribers every 1 minute */
setInterval(() => {
  const currentTime = new Date().getTime();
  for (const [userId, { fcmToken, expireTime }] of subscribers) {
    if (currentTime > expireTime) {
      subscribers.delete(userId);
    }
  }
}, validDuration / 4);

export async function onReceiveUserScoreUpdatedMessage(message) {
  const userId = message.userId;
  const updatingGlobalLeaderboard = await willChangeGlobalLeaderboard();
  if (updatingGlobalLeaderboard) {
    await notifyAllSubscribingUsers();
  } else {
    const collector = await User.findUser(userId);
    await notifyIfSubscribing(collector.friends);
  }
}

export async function getGlobalLeaderboard() {
  const users = await User.findTopUsers(100).exec();
  sortByTrophyScore(users);
  return users;
}

export async function getFriendLeaderboard(userId) {
  const friends = await User.getFriends(userId);
  const user = await User.findUser(userId);
  friends.push(user);
  sortByTrophyScore(friends);
  return friends;
}

export async function subscribeUpdate(userId, fcmToken) {
  const expireTime = new Date().getTime() + validDuration;
  subscribers.set(userId, { fcmToken, expireTime });
  return expireTime;
}

function sortByTrophyScore(users) {
  users.sort((a, b) => (a.score < b.score ? 1 : -1));
}

async function willChangeGlobalLeaderboard() {
  // TODO: implement
  return true;
}

async function notifyAllSubscribingUsers() {
  const tokens = [];
  for (const [userId, { fcmToken, expireTime }] of subscribers) {
    tokens.push(fcmToken);
  }
  await fcm.sendLeaderboardUpdateMessage(tokens);
}

async function notifyIfSubscribing(userIds) {
  const tokens = [];
  for (const userId of userIds) {
    const subscriber = subscribers.get(userId);
    if (subscriber) tokens.push(subscriber.fcmToken);
  }
  await fcm.sendLeaderboardUpdateMessage(tokens);
}
