const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');  
const placeControler = require('../controller/place');
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });




router.get("/",authControler.checkAuthenticated, (req, res) => {
    res.render("place/place");
});



router.get("/create",authControler.checkAuthenticated, (req, res) => {
    res.render("place/create_place");
});

router.post("/create", authControler.checkAuthenticated,placeControler.postCreatePlace);

module.exports = router;