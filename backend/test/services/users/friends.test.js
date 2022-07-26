import { jest } from "@jest/globals";
import friendsMock, {mockUsers} from "../../../src/services/users/__mocks__/friends.js";

jest.unstable_mockModule("../../../src/services/users/friends", friendsMock);

const friends = await import("../../../src/services/users/friends");

describe("Friends Mock", () => {
  test("retrieveFriends", async () => {
    expect(await friends.retrieveFriends("572385753286")).toBe(mockUsers);
  });
  test("getFriendRequests", async () => {
    expect(await friends.getFriendRequests("572385753286")).toBe(mockUsers);
  });
  test("sendRequest", async () => {
    expect(await friends.sendRequest("572385753286", "43952309481")).toBe(undefined);
  });
  test("deleteFriend", async () => {
    expect(await friends.deleteFriend("572385753286", "43952309481")).toBe(undefined);
  });
  test("acceptUser", async () => {
    expect(await friends.acceptUser("572385753286", "43952309481")).toBe(undefined);
  });
  test("declineUser", async () => {
    expect(await friends.declineUser("572385753286", "43952309481")).toBe(undefined);
  });
});
