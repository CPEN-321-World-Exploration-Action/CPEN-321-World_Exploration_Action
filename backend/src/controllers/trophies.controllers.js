import * as trophyCollection from "../services/trophies/trophycollection.js";

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
