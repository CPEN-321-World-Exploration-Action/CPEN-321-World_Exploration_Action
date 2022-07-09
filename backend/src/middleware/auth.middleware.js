import OAuth2Client from "google-auth-library";
// See https://developers.google.com/identity/sign-in/web/backend-auth#using-a-google-api-client-library

const CLIENT_ID=process.env.CLIENT_ID
const client = new OAuth2Client.OAuth2Client(CLIENT_ID);

export default async (req, res, next) => {

  // Don't need to authenticate tokenID if user is in authenticated session
  if (req.session.userId){
    console.log(`User Session is still valid. User ID is ${req.session.userId}`)
    next()
  }
  else{

    // Authenticate token before regenerating and storing session
    const token = req.header("Authorization");

    // if (!token) return res.status(401).send("Missing Authorization");
    console.log('Authorizing...')
    try {
      const {userId, payload} = await verifyUser(token);

      req.userId = userId
      req.payload = payload

      console.log(`Authorization Successfull: user_id: ${userId}`)
      next()
    } catch (err) {
      res.status(401).send({ error: "Authorization failed"  });
    }
  }
};

async function verifyUser(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userId = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return {userId, payload};
}
