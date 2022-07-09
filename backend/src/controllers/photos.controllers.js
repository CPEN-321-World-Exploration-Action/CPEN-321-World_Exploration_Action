import * as photoManaging from "../services/photos/photomanaging.js";
import * as photoSorting from "../services/photos/photosorting.js";
import * as photoStoring from "../services/photos/photostoring.js";

export async function uploadPhoto(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "No photo received",
    });
  }
  return res.status(201).json({
    photoId: req.file.filename
  });
}

export async function getPhoto(req, res) {
  const photoId = req.params["photoId"];
  res.download(photoId, {
    root: "uploads",
  });
}

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
