export default async (req, res, next) => {
  if (req.session.userId){
    console.log(`User Session is still valid. User ID is ${req.session.userId}`)
    req.userId = req.session.userId;
    next()
  } else {
    res.status(401).json({ error: "The user is not logged in" });
    
    // console.log(`No user ID in Session`)

    // // Authenticate token before regenerating and storing session
    // const token = req.header("Authorization");

    // // if (!token) return res.status(401).send("Missing Authorization");
    // console.log('Authorizing...')
    // try {
    //   const {userId, payload} = await googleSignIn.verifyUser(token);

    //   req.session.userId = userId
    //   // Store payload to create new User.
    //   req.payload = payload

    //   console.log(`Authorization Successful: user_id: ${userId}`)

    //   req.userId = req.session.userId;
    //   next()
    // } catch (err) {
    //   console.log(err)
    //   res.status(401).send({ error: "Authorization failed"  });
    // }
  }
};
