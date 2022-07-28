import mongoose from "mongoose";

export async function connectToDatabase(dbUrl) {
  await mongoose.connect(dbUrl);
}

export async function dropAndDisconnectDatabase() {
  try {
    await mongoose.connection.db.dropDatabase();
  } catch (err) {}
  await mongoose.connection.close();
}
