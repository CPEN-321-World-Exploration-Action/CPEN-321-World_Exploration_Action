import OAuth2Client from "google-auth-library";

const CLIENT_ID=process.env.CLIENT_ID
const client = new OAuth2Client.OAuth2Client(CLIENT_ID);

export default async (req, res, next) => {
  req.userId = "id7";
  next();
  return; 

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

      req.session.userId = userId
      // Store payload to create new User.
      req.payload = payload

      console.log(`Authorization Successful: user_id: ${userId}`)
      next()
    } catch (err) {
      res.status(401).send({ error: "Authorization failed"  });
    }
  }
};

async function verifyUser(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, 
  });
  const payload = ticket.getPayload();
  const userId = payload['sub'];
  return {userId, payload};
}
