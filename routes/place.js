const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');  
const spaceControler = require('../controller/space')
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });




router.get("/",authControler.getUserToRequest, (req, res) => {
    res.render("place");
});



router.get("/create",authControler.getUserToRequest, (req, res) => {
    res.render("place");
});



module.exports = router;