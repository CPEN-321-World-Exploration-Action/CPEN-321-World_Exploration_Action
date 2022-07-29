import { jest } from "@jest/globals";

export const verifyUser = jest.fn(async (idToken) => {
  if (idToken == null || !idToken) {
    throw new Error();
  }
  return { userId: "438952804820", payload: mockUser };
});

export const mockUser = {
  user_id: "438952804820",
  name: "Joseph Smith",
  email: "joseph.smith@gmail.com",
  picture: "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png",
  score: 890,
  rank: 8,
};
