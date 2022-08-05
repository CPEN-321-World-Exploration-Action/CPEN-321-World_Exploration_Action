import mongoose from "mongoose";
import { app } from "./app.js";

const defaultDbUri = "mongodb://localhost:27017";

export async function run() {
  console.log("Connecting to the database");
  await mongoose.connect(process.env.dbURI ?? defaultDbUri);
  console.log("Successfully connected to the database");

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

await run();
