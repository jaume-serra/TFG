const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');  
const spaceControler = require('../controller/space')
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });




router.get("/",authControler.checkAuthenticated, (req, res) => {
    res.render("place/place");
});



router.get("/create",authControler.checkAuthenticated, (req, res) => {
    console.log('req.user :>> ', req.user);
    res.render("place/create_place");
});



module.exports = router;