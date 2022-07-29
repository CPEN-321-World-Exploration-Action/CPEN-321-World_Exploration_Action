import { jest } from "@jest/globals";

export const sendNormalNotifications = jest.fn(async (tokens, title, body) => {});

export const sendLeaderboardUpdateMessage = jest.fn(async (tokens) => {});

export const sendNewChampionNotification = jest.fn(async (name, score) => {});

export const sendFriendNotification = jest.fn(async (token, title, body) => {});
