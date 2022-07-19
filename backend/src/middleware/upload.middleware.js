import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    let extension;
    switch (file.mimetype) {
      case "image/png":
        extension = "png";
        break;
      case "image/jpeg":
        extension = "jpeg";
        break;
      default:
        cb(new Error("Unknown mimetype: " + file.mimetype), null);
    }
    const unqiueNumber = Math.round(Math.random()* 1e9);
    const uniqueSuffix = Date.now() + "-" + unqiueNumber;
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
