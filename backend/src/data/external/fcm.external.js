import firebase from "firebase-admin";
import serviceAccount from "../../../firebase-service-account.json" assert { type: "json" };

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const messaging = firebase.messaging();
