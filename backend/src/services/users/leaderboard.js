import { User } from "../../data/db/user.db.js";
import * as fcm from "../../data/external/fcm.external.js";
import { BadRequestError, NotFoundError, InputError, DuplicationError, NotInDBError } from "../../utils/errors.js";

export let numberOfUsersOnLeaderboard = 10;

export let subscribers = new Map();
let validDuration = 1000 * 60 * 60; /* 1 hour */

export let oldLeaderboard = [];

/* Clean up expired subscribers every 1 minute */
let subscriberCleanup;
function startSubscriberCleanup() {
  if (subscriberCleanup) {
    clearInterval(subscriberCleanup);
  }
  subscriberCleanup = setInterval(() => {
    const currentTime = new Date().getTime();
    for (const [userId, { fcmToken, expireTime }] of subscribers) {
      if (currentTime > expireTime) {
        subscribers.delete(userId);
      }
    }
  }, validDuration / 4);
}

startSubscriberCleanup();

export async function onReceiveUserScoreUpdatedMessage(message) {
  const userId = message.userId;
  if (!userId) {
    throw new InputError("Missing userId");
  }
  const collector = await User.findUser(userId);
  if (!collector) {
    throw new NotInDBError("Cannot find the collector");
  }

  const newLeaderboard = await getGlobalLeaderboard();
  const updatingGlobalLeaderboard = await willChangeGlobalLeaderboard(
    newLeaderboard
  );
  if (updatingGlobalLeaderboard) {
    await notifyAllSubscribingUsers();
    await sendNewChampionNotificationIfNeeded(newLeaderboard);
    await sendNotificationsToUsersDroppedOut(newLeaderboard);
    oldLeaderboard = newLeaderboard;
  } else {
    await notifyIfSubscribing(collector.friends);
  }
}

export async function getGlobalLeaderboard() {
  const users = await User.findTopUsers(numberOfUsersOnLeaderboard).exec();
  sortByTrophyScore(users);
  return users;
}

export async function getFriendLeaderboard(userId) {
  if (!userId) {
    throw new InputError();
  }

  const user = await User.findUser(userId);
  if (!user) {
    throw new NotInDBError();
  }
  const friends = await User.getFriends(userId);
  friends.push(user);
  sortByTrophyScore(friends);
  return friends;
}

export async function subscribeUpdate(userId, fcmToken) {
  if (!userId || !fcmToken) {
    throw new InputError();
  }

  if (!(await User.findUser(userId))) {
    throw new NotInDBError();
  }

  const expireTime = new Date().getTime() + validDuration;
  subscribers.set(userId, { fcmToken, expireTime });
  return expireTime;
}

// helper functions

function sortByTrophyScore(users) {
  users.sort((a, b) => (a.score < b.score ? 1 : -1));
}

export async function willChangeGlobalLeaderboard(newLeaderboard) {
  if (newLeaderboard.length !== oldLeaderboard.length) {
    return true;
  }
  for (let i = 0; i < newLeaderboard.length; i++) {
    if (!compareUser(newLeaderboard[i], oldLeaderboard[i])) {
      return true;
    }
  }
  return false;
}

export async function notifyAllSubscribingUsers() {
  const tokens = [];
  for (const [userId, { fcmToken, expireTime }] of subscribers) {
    tokens.push(fcmToken);
  }
  await fcm.sendLeaderboardUpdateMessage(tokens);
}

export async function notifyIfSubscribing(userIds) {
  const tokens = [];
  for (const userId of userIds) {
    const subscriber = subscribers.get(userId);
    if (subscriber) tokens.push(subscriber.fcmToken);
  }
  await fcm.sendLeaderboardUpdateMessage(tokens);
}

export async function sendNewChampionNotificationIfNeeded(newLeaderboard) {
  if (
    oldLeaderboard.length !== 0 &&
    newLeaderboard.length !== 0 &&
    newLeaderboard[0].user_id != oldLeaderboard[0].user_id
  ) {
    await fcm.sendNewChampionNotification(
      newLeaderboard[0].name,
      newLeaderboard[0].score
    );
  }
}

export async function sendNotificationsToUsersDroppedOut(newLeaderboard) {
  const newUsers = new Set(newLeaderboard.map((x) => x.user_id));
  const targetUsers = oldLeaderboard.filter((x) => !newUsers.has(x.user_id));
  const tokens = targetUsers.map((x) => x.fcm_token).filter((x) => x);
  if (tokens.length > 0) {
    await fcm.sendNormalNotifications(
      tokens,
      "No Longer on the Leaderboard",
      "You are no longer on the leaderboard."
    );
  }
}

function compareUser(u1, u2) {
  return u1.user_id === u2.user_id && u1.score === u2.score;
}

/* For testing */
export function setSubscriptionValidDuration(duration) {
  validDuration = duration;
  startSubscriberCleanup();
}

export function setNumberOfUsersOnLeaderboard(numberOfUsers) {
  numberOfUsersOnLeaderboard = numberOfUsers;
  oldLeaderboard = [];
}