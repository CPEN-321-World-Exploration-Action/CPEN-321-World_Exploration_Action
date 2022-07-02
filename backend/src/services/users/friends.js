import { User } from "../../data/db/user.db.js";

export async function retrieveFriends(userId) {
  const user = await User.findUser(userId).exec();
  return await user.getFriends().exec();
}
