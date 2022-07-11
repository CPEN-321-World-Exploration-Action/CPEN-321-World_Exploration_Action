import * as trophyCollection from "../services/trophies/trophycollection.js";
import * as trophyDetail from "../services/trophies/trophydetails.js";

export async function collectTrophy(req, res) {
  const result = await trophyCollection.collectTrophy(
    req.userId,
    req.params["trophyId"]
  );
  if (result.success) {
    res.status(200).send();
  } else {
    res.status(400).json({
      message: result.message,
    });
  }
}

export async function getTrophiesUser(req, res) {
  try {
    const user_id = req.userId;
    const { user_latitude, user_longitude } = req.query;

    if (!user_id) {
      // This should never happen
      return res.status(400).json({ message: "No user_id provided." });
    }
    if (!user_latitude || !user_longitude) {
      return res
        .status(400)
        .json({ message: "User latitude and longitude are required." });
    }

    const trophyUser = await trophyDetail.getTrophyUser(user_id);

    if (!trophyUser) {
      return res
        .status(401)
        .json({
          message: `User with id ${user_id} not found in TrophyUser database`,
        });
    }

    const trophies = await trophyDetail.getTrophiesUser(
      user_id,
      user_latitude,
      user_longitude
    );
    if (!trophies) {
      // trophies should only be null if Places API call is erroneous or empty
      return res
        .status(404)
        .json({ message: `No Trophies found near user ${user_id}` });
    }

    res.status(200).json(trophies);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }
}


export async function getTrophyDetails(req, res){
  try{
    const {trophyId} = req.params;
    const trophies = await trophyDetail.getTrophyDetails(trophyId);
    if (!trophies || trophies.length === 0){
      return res.status(404).json({message: `Trophy with id ${trophyId} not found.`})
    }
    res.status(200).json(trophies[0])
  }catch (error){
    res.status(500).json({message:error})
  }
}

export async function getTrophyUser(req, res){
  try{
    const {user_id} = req.params;
    return await trophyDetail.getTrophyUser(user_id)
  }catch (error){
    return Error('Internal Server Error')
  }
}

export async function createTrophyUser(req, res) {
  try {
    const {user_id} = req.params;
    return await trophyDetail.createTrophyUser({user_id});
  } catch (error) {
   return Error('Internal Server Error')
  }
}
// Dev Functions
export async function getAllTrophies(req, res) {
  try {
    const trophies = await trophyDetail.getAllTrophies();
    if (!trophies) {
      return res.status(404).json({ message: "No Trophies Found" });
    }
    res.status(200).json({ trophies });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function getAllTrophiesUsers(req, res) {
  try {
    const trophies = await trophyDetail.getAllTrophiesUsers();
    if (!trophies) {
      return res.status(404).json({ message: "No Trophies Found" });
    }
    res.status(200).json({ trophies });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function createTrophy(req, res) {
  try {
    const trophy = await trophyDetail.createTrophy(req);
    res.status(201).json({ trophy });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}


export async function deleteTrophy(req, res) {
  try {
    const { id: trophyID } = req.params;
    const trophy = await trophyDetail.deleteTrophy(trophyID);
    if (!trophy) {
      return res
        .status(404)
        .json({ message: `Could not find Trophy with id: ${trophyID}` });
    }
    // Return info about deleted trophy only for testing.
    res.status(200).json({ trophy });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function updateTrophy(req, res) {
  try {
    const { id: trophyID } = req.params;

    // By default this will return the task before being updated
    // It will update it correctly, just return the old trophy here.
    // Also validators won't run without passing in the options object
    const trophy = await trophyDetail.updateTrophy(trophyID, req.body);

    if (!trophy) {
      return res
        .status(404)
        .json({ message: `No trophy with id: ${trophyID}` });
    }
    res.status(200).json({ trophy });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export async function getUserCollectedTrophy(req, res) {
  const userID = req.query.userID;

  const trophy = await trophyDetail.getUserCollectedTrophy(userID);

  if (trophy) {
    res.status(200).json({
      trophy,
    });
  } else {
    res.status(404).json({
      message: "Could not find collected trophies",
    });
  }
}

export async function getUserUncollectedTrophy(req, res) {
  const userID = req.query.userID;

  const trophy = await trophyDetail.getUserUncollectedTrophy(userID);

  if (trophy) {
    res.status(200).json({
      trophy,
    });
  } else {
    res.status(404).json({
      message: "Could not find uncollected trophies",
    });
  }
}