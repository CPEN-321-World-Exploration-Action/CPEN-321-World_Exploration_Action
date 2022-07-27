import { jest } from "@jest/globals";
import { mockGlobalLeaderboard, mockFriendLeaderboard, mockExpireTime } from "./leaderboard";

import * as leaderboard from "../leaderboard";

jest.mock("../leaderboard");

describe("Leaderboard Mock", () => {
  test("onReceiveUserScoreUpdatedMessage", async () => {
    const message = {
      type: "user_score_updated",
      userId: "572385753286",
    };
    expect(await leaderboard.onReceiveUserScoreUpdatedMessage(message)).toBe(undefined);
  });
  test("getGlobalLeaderboard", async () => {
    expect(await leaderboard.getGlobalLeaderboard()).toStrictEqual(mockGlobalLeaderboard);
  });
  test("getGlobalLeaderboard", async () => {
    expect(await leaderboard.getFriendLeaderboard("572385753286")).toStrictEqual(mockFriendLeaderboard);
  });
  test("subscribeUpdate", async () => {
    expect(await leaderboard.subscribeUpdate("572385753286", "fcmToken.abc.123")).toStrictEqual(mockExpireTime);
  });
});
