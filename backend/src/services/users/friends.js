import { User } from "../../data/user.db";

export async function retrieveFriends(userId) {
  return await User.findById(userId).exec().getFriends().exec();
}
