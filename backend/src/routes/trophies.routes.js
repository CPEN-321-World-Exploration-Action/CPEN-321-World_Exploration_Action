import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as trophyControllers from "../controllers/trophies.controllers.js";

const trophiesRouter = express.Router();

trophiesRouter.get("/:trophyId", [nocache()], trophyControllers.getTrophyDetails);
trophiesRouter.post("/:userId/:trophyId", [nocache(), auth], trophyControllers.collectTrophy);
//trophiesRouter.get("/:userId/trophies", [nocache(), auth], trophyControllers.getTrophiesUser);
trophiesRouter.get("/:user_id/trophies", trophyControllers.getTrophiesUser);


// Dev Routes
trophiesRouter.get("/Trophies", trophyControllers.getAllTrophies);
trophiesRouter.get("/Users", trophyControllers.getAllTrophiesUsers);
trophiesRouter.post("/create", trophyControllers.createTrophy);
trophiesRouter.post("/createUser", trophyControllers.createTrophyUser);
trophiesRouter.put("/:id", trophyControllers.updateTrophy);
trophiesRouter.delete("/:id", trophyControllers.deleteTrophy);

// collected/uncollected trophy
trophiesRouter.get("/collected", trophyControllers.getUserCollectedTrophy);
trophiesRouter.get("/uncollected", trophyControllers.getUserUncollectedTrophy);

export default trophiesRouter;
