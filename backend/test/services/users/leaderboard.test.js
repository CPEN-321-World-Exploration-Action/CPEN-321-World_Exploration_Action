import { jest } from "@jest/globals";
import leaderboardMock from "../../../src/services/users/__mocks__/leaderboard";

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
});
