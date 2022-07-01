import express from "express";
import mongoose from "mongoose";

import usersRouter from "./routes/users.routes.js";
import trophiesRouter from "./routes/trophies.routes.js";
import photosRouter from "./routes/photos.routes.js";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/trophies", trophiesRouter);
app.use("/photos", photosRouter);

/* catch 404 and forward to error handler */
app.use((req, res, next) => {
  res.status(404).json({
    message: "No such route exists",
  });
});

/* error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: "Error Message",
  });
});

const server = app.listen(8081, (req, res) => {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Server successfully running at http://%s:%s", host, port);
});
