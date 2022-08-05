import * as photoManaging from "../services/photos/photomanaging.js";
import * as userAccounts from "../services/users/useraccounts.js";
import * as trophyDetail from "../services/trophies/trophydetails.js";

/* Managing */

export async function userLikePhoto(req, res) {
  const picID = req.query.picID;

  if (!picID) {
    res.status(400).json({
      message: "Missing query parameter: picID",
    });
    return;
  }
  await photoManaging.userLikePhoto(req.userId, picID);
  res.status(200).send();
}

/* Sorting */

export async function getPhotoIDsByTrophyID(req, res) {
  const trophyId = req.query.trophyId;
  let order = req.query.order;

  if (!order){
    order = "random";
  }

  const trophies = await trophyDetail.getTrophyDetails(trophyId);
  if (!trophies || trophies.length === 0) {
    return res
      .status(404)
      .json({ message: `Trophy with id ${trophyId} not found.` });
  }

  const photos = await photoManaging.getPhotoIDsByTrophyID(trophyId, order, req.userId);
  if (photos) {
    res.status(200).json(photos);
  } else {
    res.status(404).json({
      message: "Could not find the photos",
    });
  }
}

export async function getPhotoIDsByUserID(req, res) {
  const userID = req.params.userId;
  const user = await userAccounts.getUserProfile(userID);
  if (!user){
    res.status(404);S
  }
  const photos = await photoManaging.getPhotoIDsByUserID(userID);
  res.status(200).json(photos);
}

/* Storing */

export async function getImage(req, res) {
  const picID = req.query.picID;

  const photo = await photoManaging.getImage(picID);

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
  await photoManaging.uploadPhoto(
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
