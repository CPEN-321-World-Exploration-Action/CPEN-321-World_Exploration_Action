import request from "supertest";
import { app } from "../../src/app.js";
import { connectToDatabase, dropAndDisconnectDatabase } from "../../src/utils/database.js";
import { TrophyTrophy, TrophyUser } from "../../src/data/db/trophy.db.js";

const testDbUri = "mongodb://localhost:27017/test_browse_trophies";

const agent = request.agent(app);

beforeAll(async () => {
    await connectToDatabase(testDbUri);
});

afterAll(async () => {
    await dropAndDisconnectDatabase();
});

beforeEach(async () => {
    await TrophyTrophy.deleteMany({});
    await TrophyUser.deleteMany({});

    // create an logged in user
    await agent
        .post("/users/accounts/tester-login")
        .expect(201);

    // initialize relevant databases
    await createTestTrophyDetails();
});

describe("Browse Trophies: Get User Trophies", () => {
    test("Retrieve List of Trophies for authenticated User", async () => {
        const res = await agent.get("/trophies/user-trophies?userId=_test_user_1&user_latitude=49.3&user_longitude=-123.3");
        expect(res.status).toStrictEqual(200); //get returned with trophyDetail.getTrophiesUser

        // check returned data
        expect(res.body.map(x => x.trophy_id).length).toStrictEqual(11); // cannot test on exact items...
        expect(res.body.map(x => x.trophy_id)).toEqual(expect.arrayContaining(["Trophy_TrophyCollection_Test",
            "Trophy_TrophyCollection_Test_Collected"]));
    });

    // ..
    test("Retrieve List of Trophies for authenticated User without any trophies", async () => {
        const set = {
            uncollectedTrophies: [" "],
            collectedTrophies: [" "],
            list_of_photos: [" "],
            trophyTags: [" "],
        };
        await TrophyUser.updateOne(
            { user_id: "_test_user_1" },
            { $set: set }
        );
        const res = await agent.get("/trophies/user-trophies?userId=_test_user_1&user_latitude=49.3&user_longitude=-123.3");
        expect(res.status).toStrictEqual(200);
        expect(res.body.map(x => x.trophy_id).length).toStrictEqual(11);
        expect(res.body.map(x => x.trophy_id)).not.toEqual(expect.arrayContaining(["Trophy_TrophyCollection_Test", "Trophy_TrophyCollection_Test_Collected"]));
    });

    test("Retrieve List of Trophies for non-authenticated User", async () => {
        const res = await request(app)
            .get("/trophies/user-trophies?userId=_test_user_1&user_latitude=49.3&user_longitude=-123.3");
        expect(res.status).toStrictEqual(401);
    });

    test("Retrieve List of Trophies for User in location without any nearby points of interest", async () => {
        const set = {
            uncollectedTrophies: [" "],
            collectedTrophies: [" "],
            list_of_photos: [" "],
            trophyTags: [" "],
        };
        await TrophyUser.updateOne(
            { user_id: "_test_user_1" },
            { $set: set }
        );
        const res = await agent.get("/trophies/user-trophies?userId=_test_user_2&user_latitude=-82&user_longitude=-129");
        expect(res.status).toStrictEqual(200);
        expect(res.body.length).toStrictEqual(0);
    });

    test("Retrieve List of Trophies for User without specifying user location", async () => {
        const res = await agent.get("/trophies/user-trophies");
        expect(res.status).toStrictEqual(400);
    });

    test("Retrieve List of Trophies for User with incorrect location format", async () => {
        const res = await agent.get("/trophies/user-trophies?user_latitude=abc&user_longitude=-129");
        expect(res.status).toStrictEqual(400);
    });
});

async function createTestTrophyDetails() {
    await TrophyUser.create({
        user_id: "_test_user_1",
        uncollectedTrophies: [" ", "Trophy_TrophyCollection_Test"],
        collectedTrophies: [" ", "Trophy_TrophyCollection_Test_Collected"],
        list_of_photos: [" "],
        trophyTags: [" "],
    });

    await TrophyUser.create({
        user_id: "_test_user_2",
        uncollectedTrophies: [" "],
        collectedTrophies: [" "],
        list_of_photos: [" "],
        trophyTags: [" "],
    });

    await TrophyTrophy.create({
        trophy_id: "Trophy_TrophyCollection_Test",
        name: "Trophy_TrophyCollection_Test",
        latitude: 49.3,
        longitude: -123.3,
        number_of_collectors: 0,
        quality: "Bronze",
        list_of_photos: [" "],
        list_of_collectors: [" "],
    });

    await TrophyTrophy.create({
        trophy_id: "Trophy_TrophyCollection_Test_Collected",
        name: "Trophy_TrophyCollection_Test_Collected",
        latitude: 200,
        longitude: 200,
        number_of_collectors: 1,
        quality: "Bronze",
        list_of_photos: [" "],
        list_of_collectors: [" ", "_test_user_1"],
    });
}