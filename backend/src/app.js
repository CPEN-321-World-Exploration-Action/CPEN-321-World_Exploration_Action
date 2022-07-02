import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import "express-async-errors";

import usersRouter from "./routes/users.routes.js";
import trophiesRouter from "./routes/trophies.routes.js";
import photosRouter from "./routes/photos.routes.js";

const defaultDbUri = "mongodb://localhost:27017";

const app = express();

app.use(express.json());
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
  )
);

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
    message: "Internal Server Error",
  });
});

async function run() {
  try {
    console.log("Connecting to the database");
    await mongoose.connect(process.env.dbURI ?? defaultDbUri);
    console.log("Successfully connected to the database");
  } catch (err) {
    console.log("Failed to connect to the database", err);
    return;
  }

  try {
    var server = app.listen(8081, (req, res) => {
      var host = server.address().address;
      var port = server.address().port;
      console.log("Server successfully running at http://%s:%s", host, port);
    });
  } catch (err) {
    console.log(err);
    await mongoose.connection.close();
  }
}

run();
