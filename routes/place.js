const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');
const placeControler = require('../controller/place');
const dotenv = require("dotenv");

//Pujar imatges
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })

dotenv.config({ path: "./config/config.env" });




router.get("/:id", authControler.checkAuthenticated, placeControler.getPlace);



router.get("/create", authControler.checkAuthenticated, (req, res) => {
    res.render("place/create_place");
});

router.post("/create", [authControler.checkAuthenticated, upload.array('files', 10)], placeControler.postCreatePlace);

module.exports = router;