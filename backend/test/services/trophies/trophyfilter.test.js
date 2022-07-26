import { jest } from "@jest/globals";

import * as trophyFilter from "../../../src/services/trophies/trophyfilter";
import { TrophyUser, TrophyTrophy } from "../../../src/data/db/trophy.db.js";

describe("Trophy_Detail Module getTrophyDetails Test", () => {
    /* List<TrophyTrophy> filterTrophies(String userID, List<TrophyTrophy> trophies) */

    test("filterTrophies", async () => {
        let userID = "User";
        let trophies = ["T1", "T2", "T3"];
        expect(trophyFilter.filterTrophies(userID, trophies)).toEqual("a filtered trophy list");
    });

    test("filterTrophies_user_not_in_DB", async () => {
        let userID = "UserNotInDB";
        let trophies = ["T1", "T2", "T3"];
        expect(trophyFilter.filterTrophies(userID, trophies)).toThrow(NotInDBError);
    });

    test("filterTrophies_user_invalid", async () => {
        let trophies = ["T1", "T2", "T3"];
        expect(trophyFilter.filterTrophies(null, trophies)).toThrow(InputError);
        expect(trophyFilter.filterTrophies(undefined, trophies)).toThrow(InputError);
        expect(trophyFilter.filterTrophies(NaN, trophies)).toThrow(InputError);
    });

    test("filterTrophies_trophy_invalid", async () => {
        let trophies = "An invalid list of trophytrophy";
        let userID = "User"
        expect(trophyFilter.filterTrophies(userID, trophies)).toThrow(InputError);
        expect(trophyFilter.filterTrophies(userID, null)).toThrow(InputError);
        expect(trophyFilter.filterTrophies(userID, undefined)).toThrow(InputError);
    });

    test("filterTrophies_trophy_empty", async () => {
        let trophies = [];
        let userID = "User"
        expect(trophyFilter.filterTrophies(userID, trophies)).toEqual([]);
    });
});