import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as trophyControllers from "../controllers/trophies.controllers.js";

const trophiesRouter = express.Router();

trophiesRouter.post(
  "/:trophyId/collect",
  [nocache(), auth],
  trophyControllers.collectTrophy
);

export default trophiesRouter;
