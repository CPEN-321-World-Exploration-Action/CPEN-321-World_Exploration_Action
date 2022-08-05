import multer from "multer";
import { BadRequestError } from "../utils/errors.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    let extension;
    switch (file.mimetype) {
      case "image/png":
        extension = "png";
        break;
      default:
        cb(new BadRequestError("Unknown mimetype: " + file.mimetype), null);
    }
    // const billion = BigInt(1e9)
    // const unqiueNumber = Math.round(Math.random()*billion);
    const uniqueSuffix = Date.now() + "-" + generateRandomString(12);
    cb(
      null,
      req.params["trophyId"] +
        "-" +
        req.params["userId"] +
        "-" +
        uniqueSuffix +
        "." +
        extension
    );
  },
});

export default multer({ storage: storage });

function generateRandomString(length){
    var result = '';
    for (var i=0; i < length; i++){
      const randomUnicode = Math.floor(Math.random() * (90 - 65 + 1) + 65) // random unicode between 65 (A) and 90 (Z)
      result += String.fromCharCode(randomUnicode);
    }
    return result
}