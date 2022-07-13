import { jest } from "@jest/globals";
import leaderboardMock, {mockGlobalLeaderboard, mockFriendLeaderboard, mockExpireTime} from "../../../src/services/users/__mocks__/leaderboard";

jest.unstable_mockModule("../../../src/services/users/leaderboard", leaderboardMock);

const leaderboard = await import("../../../src/services/users/leaderboard");

describe("Leaderboard Mock", () => {
  test("onReceiveUserScoreUpdatedMessage", async () => {
    const message = {
      type: "user_score_updated",
      userId: "572385753286",
    };
    expect(await leaderboard.onReceiveUserScoreUpdatedMessage(message)).toBe(undefined);
  });
  test("getGlobalLeaderboard", async () => {
    expect(await leaderboard.getGlobalLeaderboard()).toBe(mockGlobalLeaderboard);
  });
  test("getGlobalLeaderboard", async () => {
    expect(await leaderboard.getFriendLeaderboard("572385753286")).toBe(mockFriendLeaderboard);
  });
  test("subscribeUpdate", async () => {
    expect(await leaderboard.subscribeUpdate("572385753286", "fcmToken.abc.123")).toBe(mockExpireTime);
  });
});
