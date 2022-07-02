import { User } from "../../data/user.db.js";

export async function getUserProfile(userId) {
  return await User.findById(userId).exec();
}
