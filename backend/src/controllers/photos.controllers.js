import * as photoManaging from "../services/photos/photomanaging.js";
import * as photoSorting from "../services/photos/photosorting.js";
import * as photoStoring from "../services/photos/photostoring.js";

/* Managing */

export async function userLikePhoto(req, res) {
  const userID = req.query.userID;
  const picID = req.query.picID;

  if (!userID) {
    res.status(400).json({
      message: "Missing query parameter: userID",
    });
    return;
  } else if (!picID) {
    res.status(400).json({
      message: "Missing query parameter: picID",
    });
    return;
  }
  await photoManaging.userLikePhoto(userID, picID);
  res.status(200).send();
}

/* Sorting */

export async function getPhotoIDsByTrophyID(req, res) {
  const trophyID = req.query.trophyID;
  const order = req.query.order;

  const photos = await photoSorting.getPhotoIDsByTrophyID(trophyID, order);
  if (photos) {
    res.status(200).json({
      photos,
    });
  } else {
    res.status(404).json({
      message: "Could not find the photos",
    });
  }
}

export async function getPhotoIDsByUserID(req, res) {
  const userID = req.query.userID;

  const photos = await photoSorting.getPhotoIDsByUserID(userID);
  if (photos) {
    res.status(200).json({
      photos,
    });
  } else {
    res.status(404).json({
      message: "Could not find the photos",
    });
  }
}

/* Storing */

/*
export async function uploadPhoto(req, res) {
  const userID = req.query.userID;
  const trophyID = req.query.trophyID;
  const photoURL = req.query.photoURL;

  if (!userID) {
    res.status(400).json({
      message: "Missing query parameter: userID",
    });
    return;
  } else if (!trophyID) {
    res.status(400).json({
      message: "Missing query parameter: trophyID",
    });
    return;
  } else if (!photoURL) {
    res.status(400).json({
      message: "Missing query parameter: photoURL",
    });
    return;
  }

  await photoStoring.uploadPhoto(userID, trophyID, photoURL);
  res.status(200).send();
}
*/

export async function getImage(req, res) {
  const picID = req.query.picID;

  const photo = await photoStoring.getImage(picID);

  if (photo) {
    res.status(200).json({
      photo,
    });
  } else {
    res.status(404).json({
      message: "Could not find the photo",
    });
  }
}

export async function uploadPhoto(req, res) {
  if (!req.file) {
    res.status(400).json({
      message: "No photo received",
    });
  }
  await photoStoring.uploadPhoto(
    req.params["userId"],
    req.params["trophyId"],
    req.file.filename
  );
  res.status(201).json({
    photoId: req.file.filename,
  });
}

export async function getPhoto(req, res) {
  const photoId = req.params["photoId"];
  res.download(photoId, {
    root: "uploads",
  });
}
