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
router.post("/profile", [authControler.checkAuthenticated, upload.single('file')], userControler.postProfile);
router.get("/spacerent", authControler.checkAuthenticated, userControler.getSpaceRent);
router.post("/sparcerent/anular", authControler.checkAuthenticated, userControler.postStopRent);

router.get("/myspaces", authControler.checkAuthenticated, userControler.getMySpaces);
router.post("/myspaces/anular", authControler.checkAuthenticated, userControler.postStopRentPlace);
router.post("/myspaces/delete", authControler.checkAuthenticated, userControler.postDeleteSpace);






module.exports = router;