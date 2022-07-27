import { jest } from "@jest/globals";
import { mockUsers } from "./friends.js";

import * as friends from "../friends.js";

jest.mock("../friends.js");

describe("Friends Mock", () => {
  test("retrieveFriends", async () => {
    expect(await friends.retrieveFriends("572385753286")).toStrictEqual(mockUsers);
    expect(friends.retrieveFriends).toHaveBeenCalledWith("572385753286");
  });
  test("getFriendRequests", async () => {
    expect(await friends.getFriendRequests("572385753286")).toStrictEqual(mockUsers);
    expect(friends.getFriendRequests).toHaveBeenCalledWith("572385753286");
  });
  test("sendRequest", async () => {
    expect(await friends.sendRequest("572385753286", "43952309481")).toBe(undefined);
    expect(friends.sendRequest).toHaveBeenCalledWith("572385753286", "43952309481");
  });
  test("deleteFriend", async () => {
    expect(await friends.deleteFriend("572385753286", "43952309481")).toBe(undefined);
    expect(friends.deleteFriend).toHaveBeenCalledWith("572385753286", "43952309481");
  });
  test("acceptUser", async () => {
    expect(await friends.acceptUser("572385753286", "43952309481")).toBe(undefined);
    expect(friends.acceptUser).toHaveBeenCalledWith("572385753286", "43952309481");
  });
  test("declineUser", async () => {
    expect(await friends.declineUser("572385753286", "43952309481")).toBe(undefined);
    expect(friends.declineUser).toHaveBeenCalledWith("572385753286", "43952309481");
  });
});
