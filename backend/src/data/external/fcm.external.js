import firebase from "firebase-admin";
import serviceAccount from "../../../firebase-service-account.json" assert { type: "json" };

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const messaging = firebase.messaging();

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
