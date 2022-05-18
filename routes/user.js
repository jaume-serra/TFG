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



module.exports = router;