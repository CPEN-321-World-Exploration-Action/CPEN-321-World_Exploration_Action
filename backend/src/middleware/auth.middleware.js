export default async (req, res, next) => {
  if (req.session.userId){
    console.log(`User Session is still valid. User ID is ${req.session.userId}`)
    req.userId = req.session.userId;
    next()
  } else {
    console.log(`No User ID in session`);
    res.status(401).json({ error: "The user is not logged in" });
  }
};
