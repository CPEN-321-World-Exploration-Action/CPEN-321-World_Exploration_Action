import { User } from "../../data/db/user.db.js";
import * as fcm from "../../data/external/fcm.external.js";

const numberOfUsersOnLeaderboard = 2;
const notificationThreshold = 5;

let subscribers = new Map();
const validDuration = 1000 * 60 * 60; /* 1 hour */

let oldLeaderboard = [];

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
  const newLeaderboard = await getGlobalLeaderboard();
  const updatingGlobalLeaderboard = await willChangeGlobalLeaderboard(
    newLeaderboard
  );
  if (updatingGlobalLeaderboard) {
    await notifyAllSubscribingUsers();
    oldLeaderboard = newLeaderboard;
  } else {
    const collector = await User.findUser(userId);
    await notifyIfSubscribing(collector.friends);
  }
}

export async function getGlobalLeaderboard() {
  const users = await User.findTopUsers(numberOfUsersOnLeaderboard).exec();
  sortByTrophyScore(users);
  return users;
}

export async function getFriendLeaderboard(userId) {
  const friends = await User.getFriends(userId);
  const user = await User.findUser(userId);
  if (!friends.map((x) => x.user_id).includes(user.user_id)) {
    friends.push(user);
  }
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

async function willChangeGlobalLeaderboard(newLeaderboard) {
  if (newLeaderboard.length !== oldLeaderboard.length) {
    console.log("Global leaderboard updated");
    return true;
  }
  for (let i = 0; i < newLeaderboard.length; i++) {
    if (
      newLeaderboard[i].user_id !== oldLeaderboard[i].user_id ||
      newLeaderboard[i].score !== oldLeaderboard[i].score
    ) {
      console.log("Global leaderboard updated");
      return true;
    }
  }
  return false;
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

function compareLeaderboard(x, y) {}
