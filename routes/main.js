const express = require("express");
const router = express.Router();

const authControler = require('../controller/auth');

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });



router.get("/", authControler.getUserToRequest, (req, res) => {
    res.render("main/index");
});
router.all("/manifest.json", (req, res) => {
    res.sendFile("/manifest.json")
})
router.all("/assetlinks.json", (req, res) => {
    res.sendFile("/.well-known/assetlinks.json")
})
router.all("/mapa", authControler.getUserToRequest, (req, res) => {
    res.render("main/mapa");
});

router.all("/privacitat", authControler.getUserToRequest, (req, res) => {
    res.render("main/privacyPolicy")
})

router.get("/contact", authControler.getUserToRequest, (req, res) => {
    res.render("main/contact");
});

router.post("/contact", authControler.getUserToRequest, authControler.postContact)

router.get("/register", authControler.checkNotAuthenticated, authControler.getRegister)
router.post("/register", authControler.checkNotAuthenticated, authControler.postRegister)


router.get("/login", authControler.checkNotAuthenticated, authControler.getLogin);
router.post("/login", authControler.checkNotAuthenticated, authControler.postLogin)

router.get("/forgot-password", authControler.checkNotAuthenticated, authControler.getForgotPassword);
router.post("/forgot-password", authControler.checkNotAuthenticated, authControler.postForgotPassword)

router.get("/profile", authControler.checkAuthenticated, (req, res) => {
    res.redirect("user/profile");
});

router.get("/logout", (req, res) => {
    if (req.cookies["session-token"]) res.clearCookie("session-token")
    if (req.cookies["session-token-default"]) res.clearCookie("session-token-default")
    res.redirect("/");
});

module.exports = router;