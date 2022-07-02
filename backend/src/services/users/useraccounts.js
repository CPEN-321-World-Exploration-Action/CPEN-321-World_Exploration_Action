import { User } from "../../data/db/user.db.js";

export async function getUserProfile(userId) {
  return await User.findUser(userId).exec();
}
