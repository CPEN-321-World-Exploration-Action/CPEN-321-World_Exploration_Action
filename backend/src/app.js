import "dotenv/config";
import express from "express";
import morgan from "morgan";
import "express-async-errors";
import session from 'express-session'

import usersRouter from "./routes/users.routes.js";
import trophiesRouter from "./routes/trophies.routes.js";
import photosRouter from "./routes/photos.routes.js";

export const app = express();

app.use(express.json());
app.use(
  morgan('[:date[clf]] :remote-addr ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms')
);

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "secret" + Math.random(),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
}))

app.use("/users", usersRouter);
app.use("/trophies", trophiesRouter);
app.use("/photos", photosRouter);

/* catch 404 */
app.use((req, res, next) => {
  res.status(404).json({
    message: "Cannot " + req.method + " " + req.url,
  });
});

/* error handler */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
  });
});
