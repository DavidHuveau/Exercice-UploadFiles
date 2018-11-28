const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
// const upload = multer({ dest: "tmp/" });

const storage = multer.diskStorage({
  //multers disk storage settings
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname + "-" + Date.now());
    cb(
      null,
      `${file.originalname.split(".")[0]}-${Date.now()}${
        file.originalname.split(".")[1]
      }`
    );
  }
});

const upload = multer({
  dest: "tmp/",
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    if (!file.mimetype.includes("image/png")) {
      req.fileValidationError = "goes wrong on the mimetype...";
      // return cb(new Error("goes wrong on the mimetype"));
      return cb(null, false);
    }
    cb(null, true);
  }
});

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("My Time: ", Date.now());
//   next();
// });
/* GET users listing. */
router
  .route("/")
  .get((req, res) => {
    res.send(
      `<form method="POST" enctype="multipart/form-data" action="monupload">
      <input type="file" name="monfichier" multiple>
      <button> envoyer </button>
      </form>`
    );
  })
  // autorise un seul fichier à télécharger
  // .post(upload.single("monfichier"), (req, res) => {
  //   console.log(req.file);
  //   fs.rename(req.file.path, "public/images/" + req.file.originalname, err => {
  //     if (err) {
  //       res.send("problème durant le déplacement");
  //     } else {
  //       res.send("Fichier uploadé avec succès");
  //     }
  //   });
  // });

  // autorise plusieurs fichiers à télécharger
  // .post(upload.array("monfichier", 3), (req, res) => {
  //   console.log(req.files);
  //   req.files.forEach(file => {
  //     fs.rename(file.path, "public/images/" + file.originalname, err => {
  //       if (err) throw err;
  //     });
  //   });
  //   res.end("Fichier(s) uploadé(s) avec succès");
  // });

  // autorise plusieurs fichiers à télécharger
  .post(upload.array("monfichier", 3), (req, res) => {
    // console.log(req.files);
    if (req.fileValidationError) res.end(req.fileValidationError);
    else res.end("Fichier(s) uploadé(s) avec succès");
  });

module.exports = router;
