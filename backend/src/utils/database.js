import mongoose from "mongoose";

export async function connectToDatabase(dbUrl) {
  await mongoose.connect(dbUrl);
}

export async function dropAndDisconnectDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}
