const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');  

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });







router.get("/",authControler.getUserToRequest, (req, res) => {
    console.log('req.user :>> ', req.user);
    res.render("index",{ user:req.user }); /* FIXME: arreglar user */
});

router.all("/mapa", authControler.getUserToRequest, (req, res) => {
    res.render("mapa.ejs",{ user: req.user });
});



router.get("/register", authControler.checkNotAuthenticated, authControler.getRegister)
router.post("/register", authControler.checkNotAuthenticated, authControler.postRegister)


router.get("/login", authControler.checkNotAuthenticated, authControler.getLogin);
router.post("/login", authControler.postLogin)


router.get("/profile", authControler.checkAuthenticated, (req, res) => {
    console.log('req.user :>> ', req.user);
    res.render("profile", { user: req.user });
});


router.get("/logout", (req, res) => {
    if(req.cookies["session-token"]) res.clearCookie("session-token")
    if (req.cookies["session-token-default"]) res.clearCookie("session-token-default")
    res.redirect("/");
});

module.exports = router;