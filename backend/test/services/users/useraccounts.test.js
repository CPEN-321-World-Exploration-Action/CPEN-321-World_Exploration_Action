import { jest } from "@jest/globals";
import userAccountsMock, {mockUser, mockUsers} from "../../../src/services/users/__mocks__/useraccounts";

jest.unstable_mockModule("../../../src/services/users/useraccounts", userAccountsMock);

const userAccounts = await import("../../../src/services/users/useraccounts");

describe("User Accounts Mock", () => {
  test("onReceiveTrophyCollectedMessage", async () => {
    const message = {
      type: "trophy_collected",
      userId: "348899490324",
      trophyId: "98rq9438aeigvni9",
      trophyScore: 10,
    };
    expect(await userAccounts.onReceiveTrophyCollectedMessage(message)).toBe(undefined);
  });
  test("getUserProfile", async () => {
    expect(await userAccounts.getUserProfile("438952804820")).toBe(mockUser);
  });
  test("uploadFcmToken", async () => {
    expect(await userAccounts.uploadFcmToken("438952804820", "fcmToken.abc.123")).toBe(undefined);
  });
  test("loginWithGoogle", async () => {
    expect(await userAccounts.loginWithGoogle("agih2eawwf3ui4h28w.faeq23r2.faeff23")).toBe(mockUser);
  });
  test("searchUser", async () => {
    expect(await userAccounts.searchUser("Joseph")).toBe(mockUsers);
  });
  test("signOut", async () => {
    expect(await userAccounts.signOut()).toBe(undefined);
  });
});
