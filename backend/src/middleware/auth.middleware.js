import OAuth2Client from "google-auth-library";
// See https://developers.google.com/identity/sign-in/web/backend-auth#using-a-google-api-client-library

const CLIENT_ID = "507381724545-m57l9rgam8evoivp0s85ll0sa4d3uj7g.apps.googleusercontent.com"
const client = new OAuth2Client.OAuth2Client(CLIENT_ID);

export default (req, res, next) => {
  //const token = req.header("Authorization");
  // if (!token) return res.status(401).send("Missing Authorization");
  const token = req.body.token;
  try {
    // const userId = verifyUser(token);
    //req.userId = verifyUser(token).catch(console.error);
    req.userId = '1';
    console.log(req.body.token);
  } catch (err) {
    res.status(401).send({ error: "Authorization failed" });
  }
  next();
};

async function verifyUser(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return userid;
}
