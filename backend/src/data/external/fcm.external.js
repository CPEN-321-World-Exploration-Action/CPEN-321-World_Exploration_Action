import firebase from "firebase-admin";
import serviceAccount from "../../../firebase-service-account.json" assert { type: "json" };

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const messaging = firebase.messaging();

export async function sendNormalNotifications(tokens, title, body) {
  console.log(
    `Sending NormalNotification to ${tokens}, title: ${title}, body: ${body}`
  );
  await messaging.sendMulticast({
    notification: {
      title,
      body,
    },
    tokens,
  });
}

/**
 * Send a multicast message to devices to notify an leaderboard update
 * @export
 * @param {[String]} the target devices' FCM registration tokens
 */
export async function sendLeaderboardUpdateMessage(tokens) {
  console.log("Sending LeaderboardUpdateMessage to:", tokens);
  if (tokens.length == 0) return;
  await messaging.sendMulticast({
    data: {
      type: "update",
      update: "leaderboard",
    },
    tokens,
  });
}

export async function sendNewChampionNotification(name, score) {
  console.log(
    `Sending NewChampionNotification, name: ${name}, score: ${score}`
  );
  await messaging.send({
    notification: {
      title: "New Champion",
      body: `${name} with score ${score} is the new champion!`,
    },
    topic: "new_champion",
  });
}

export async function sendFriendNotification(token, title, body) {
  console.log("Sending FriendNotification to:", token);
  await messaging.send({
    data: {
      type: "update",
      update: "friends",
    },
    notification: {
      title,
      body,
    },
    token,
  });
}
