import * as photoManaging from "../services/photos/photomanaging.js";
import * as photoSorting from "../services/photos/photosorting.js";
import * as photoStoring from "../services/photos/photostoring.js";

export async function getPhotoIDsByTrophyID(req, res) {

  const trophyID = req.params["trophyID"];
  const order = req.params["order"];

  const photos = await photoSorting.getPhotoIDsByTrophyID(trophyID, order);
  if (photos) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(404).json({
      message: "Could not find the photos",
    });
  }
}
