const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');
const userControler = require('../controller/user');
const dotenv = require("dotenv");

//Pujar imatges
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })

dotenv.config({ path: "./config/config.env" });







router.get("/profile", authControler.checkAuthenticated, userControler.getProfile);
router.post("/profile", [authControler.checkAuthenticated, upload.array('files', 1)], userControler.postProfile);


// //Ha de ser la última ruta
// router.get("/:id", authControler.getUserToRequest, placeControler.getPlace);
// router.post("/:id", authControler.getUserToRequest, placeControler.postPlace);

module.exports = router;