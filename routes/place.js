const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');
const placeControler = require('../controller/place');
const dotenv = require("dotenv");

//Pujar imatges
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })

dotenv.config({ path: "./config/config.env" });







router.get("/create", authControler.checkAuthenticated, placeControler.getCreatePlace);

router.post("/create", [authControler.checkAuthenticated, upload.array('files', 10)], placeControler.postCreatePlace);

router.get("/:id/:rentKey", authControler.checkAuthenticated, placeControler.getRentPlace);


//Ha de ser la última ruta
router.get("/:id", authControler.getUserToRequest, placeControler.getPlace);
router.post("/:id", authControler.getUserToRequest, placeControler.postPlace);

module.exports = router;