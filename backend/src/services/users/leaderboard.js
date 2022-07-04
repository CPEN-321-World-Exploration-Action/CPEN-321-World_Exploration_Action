import { User } from "../../data/db/user.db.js";
import * as fcm from "../../data/external/fcm.external.js";

let subscribers = new Map();

/* Clean up expired subscribers every 1 minute */
setInterval(() => {
  const currentTime = new Date().getTime();
  for (const [userId, { fcmToken, expireTime }] of subscribers) {
    if (currentTime > expireTime) {
      subscribers.delete(userId);
    }
  }
}, 1000 * 60 /* 1 minute */);

export async function onReceiveUserScoreUpdatedMessage(collectedTrophyId) {
  await notifyAllSubscribingUsers();
}

export async function getGlobalLeaderboard() {
  const users = await User.findTopUsers(100).exec();
  sortByTrophyScore(users);
  return users;
}

export async function getFriendLeaderboard(userId) {
  const user = await User.findUser(userId).exec();
  let friends = await user.getFriends().exec();
  sortByTrophyScore(friends);
  return friends;
}

export async function subscribeUpdate(userId, fcmToken) {
  const expireTime = new Date().getTime() + 1000 * 60 * 60; /* 1 hour */
  subscribers.set(userId, { fcmToken, expireTime });
  return expireTime;
}

function sortByTrophyScore(users) {
  users.sort((a, b) => (a.score < b.score ? 1 : -1));
}

async function notifyAllSubscribingUsers() {
  const tokens = [];
  subscribers.forEach((userId, { fcmToken, expireTime }) => {
    tokens.push(fcmToken);
  });
  await fcm.sendLeaderboardUpdateMessage(tokens);
}

async function notifyIfSubscribing(userIds) {
  const tokens = [];
  for (const userId of userIds) {
    const [userId, { fcmToken, expireTime }] = subscribers.get(0);
    if (fcmToken) tokens.push(fcmToken);
  }
  await fcm.sendLeaderboardUpdateMessage(tokens);
}
