const express = require("express");
const router = express.Router();

const mainControler = require('../controller/main');  

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });







router.get("/", (req, res) => {
    res.render("index");
});

router.all("/mapa", (req, res) => {
    res.render("mapa.ejs", {});
});



router.get("/register", mainControler.checkNotAuthenticated, mainControler.getRegister)
router.post("/register", mainControler.checkNotAuthenticated, mainControler.postLogin)


router.get("/login", mainControler.checkNotAuthenticated, mainControler.getLogin);
router.post("/login", mainControler.postLogin)


router.get("/profile", mainControler.checkAuthenticated, (req, res) => {
    res.render("profile", { name: req.user.firstName, user: req.user });
});


router.get("/logout", (req, res) => {
    if(req.cookies["session-token"])       res.clearCookie("session-token")
    else if (req.cookies["session-token-default"]) res.clearCookie("session-token-default")
    res.redirect("/");
});

module.exports = router;