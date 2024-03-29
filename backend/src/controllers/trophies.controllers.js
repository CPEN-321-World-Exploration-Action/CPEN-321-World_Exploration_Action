import * as trophyCollection from "../services/trophies/trophycollection.js";
import * as trophyDetail from "../services/trophies/trophydetails.js";
import { BadRequestError } from "../utils/errors.js";

export async function collectTrophy(req, res) {
  const userId = req.params.userId;
  const trophyId = req.params.trophyId;
  await trophyCollection.collectTrophy(userId, trophyId);
  res.status(200).send();
}

export async function getTrophiesUser(req, res) {
  const user_id = req.userId;
  const user_latitude = req.query.user_latitude;
  const user_longitude = req.query.user_longitude;

  if ((user_latitude && isNaN(user_latitude)) || (user_longitude && isNaN(user_longitude))) {
    return res
      .status(400)
      .json({ message: "Valid user latitude and longitude are required." });
  }

  const trophies = await trophyDetail.getTrophiesUser(
    user_id,
    user_latitude,
    user_longitude
  );

  res.status(200).json(trophies);
}

export async function getTrophyDetails(req, res) {
  const trophyId = req.params.trophyId;
  const trophies = await trophyDetail.getTrophyDetails(trophyId);
  if (!trophies || trophies.length === 0) {
    return res
      .status(404)
      .json({ message: `Trophy with id ${trophyId} not found.` });
  }
  res.status(200).json(trophies[0]);
}

/* Functions for Tests */
export async function resetTrophyUser(req, res) {
  await trophyDetail.resetTrophyUserForTester(req.userId);
  res.status(201).send();
}

/*
export async function createTestTrophyDetails(req, res) {
  await trophyDetail.createTestTrophyDetails();
  res.status(201).send();
}
*/

// // Dev Functions
// export async function getTrophyUser(req, res){
//   const userId = req.params.user_id;
//   if (!userId) {
//     throw new BadRequestError("Missing query: userId");
//   }
//   return await trophyDetail.getTrophyUser(userId);
// }

// export async function createTrophyUser(req, res) {
//   const userId = req.params.user_id;
//   if (!userId) {
//     throw new BadRequestError("Missing query: userId");
//   }
//   return await trophyDetail.createTrophyUser({ user_id });
// }

// export async function getAllTrophies(req, res) {
//   const trophies = await trophyDetail.getAllTrophies();
//   if (!trophies) {
//     return res.status(404).json({ message: "No Trophies Found" });
//   }
//   res.status(200).json({ trophies });
// }

// export async function getAllTrophiesUsers(req, res) {
//   const trophies = await trophyDetail.getAllTrophiesUsers();
//   if (!trophies) {
//     return res.status(404).json({ message: "No Trophies Found" });
//   }
//   res.status(200).json({ trophies });
// }

// export async function createTrophy(req, res) {
//   const trophy = await trophyDetail.createTrophy(req);
//   res.status(201).json({ trophy });
// }

// export async function deleteTrophy(req, res) {
//   const trophyID = req.params.id;
//   const trophy = await trophyDetail.deleteTrophy(trophyID);
//   if (!trophy) {
//     return res
//       .status(404)
//       .json({ message: `Could not find Trophy with id: ${trophyID}` });
//   }
//   // Return info about deleted trophy only for testing.
//   res.status(200).json({ trophy });
// }

// export async function updateTrophy(req, res) {
//   const trophyID = req.params.id;

//   // By default this will return the task before being updated
//   // It will update it correctly, just return the old trophy here.
//   // Also validators won't run without passing in the options object
//   const trophy = await trophyDetail.updateTrophy(trophyID, req.body);

//   if (!trophy) {
//     return res
//       .status(404)
//       .json({ message: `No trophy with id: ${trophyID}` });
//   }
//   res.status(200).json({ trophy });
// }

// export async function getUserCollectedTrophy(req, res) {
//   const userID = req.query.userID;

//   const trophy = await trophyDetail.getUserCollectedTrophy(userID);

//   if (trophy) {
//     res.status(200).json({
//       trophy,
//     });
//   } else {
//     res.status(404).json({
//       message: "Could not find collected trophies",
//     });
//   }
// }

// export async function getUserUncollectedTrophy(req, res) {
//   const userID = req.query.userID;

//   const trophy = await trophyDetail.getUserUncollectedTrophy(userID);

//   if (trophy) {
//     res.status(200).json({
//       trophy,
//     });
//   } else {
//     res.status(404).json({
//       message: "Could not find uncollected trophies",
//     });
//   }
// }
