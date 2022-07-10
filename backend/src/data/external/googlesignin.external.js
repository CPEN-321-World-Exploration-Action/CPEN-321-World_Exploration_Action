import OAuth2Client from "google-auth-library";

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client.OAuth2Client(CLIENT_ID);

export async function verifyUser(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userId = payload.sub;
  return { userId, payload };
}
