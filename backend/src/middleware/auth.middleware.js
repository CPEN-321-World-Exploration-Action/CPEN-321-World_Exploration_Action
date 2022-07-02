export default (req, res, next) => {
  const token = req.header("Authorization");
  // if (!token) return res.status(401).send("Missing Authorization");

  try {
    // const userId = verifyUser(token);
    // req.userId = userId;
  } catch (err) {
    res.status(401).send({ error: "Authorization failed" });
  }
  next();
};
