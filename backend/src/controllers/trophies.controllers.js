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
    const trophies = await trophyDetail.getTrophiesUser(
        req.userId ,
        req.params["userLocation"]
    );
    res.status(200).json(trophies);
}

// Dev Functions
export async function getAllTrophies(req, res){
  try{
    const trophies = await trophyDetail.getAllTrophies();
    if(!trophies){
      return res.status(404).json({message: "No Trophies Found"})
    }
    res.status(200).json({trophies})
  }catch (error){
    res.status(500).json({message: error})
  }
}


export async function createTrophy(req, res){
  try{
    const trophy = await trophyDetail.createTrophy(req);
    res.status(201).json({trophy})
  }catch (error){
    res.status(500).json({message: error})
  }

}