const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controller/main.js");
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

let userControler = require('../controller/main');  

const bcrypt = require('bcrypt'); /* Nose si fa falta */
const dotenv = require("dotenv");
const { hasBrowserCrypto } = require("google-auth-library/build/src/crypto/crypto");
const { UserRefreshClient } = require("google-auth-library");
dotenv.config({ path: "./config/config.env" });

/* Comprova si l'usuari no està loggejat */
const checkNotAuthenticated = (req, res, next) => {
    let token = req.cookies["session-token"];
    if (!token) {
        next();
    }
    verifyToken(token)
        .then((user) => {
            res.redirect("/profile");
        })
        .catch((err) => {
            next();
        });
};

/* Comprova si l'usuari està loggejat  */
const checkAuthenticated = (req, res, next) => {
    let token = req.cookies["session-token"];

    verifyToken(token)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            res.redirect("/login");
        });
};

router.get("/", (req, res) => {
    res.render("index");
});

router.all("/mapa", (req, res) => {
    res.render("mapa.ejs", {});
});



router.get("/register", checkNotAuthenticated, (req,res) =>{

    res.render("register")
})


router.post("/register", async (req,res) => {
    /* TODO: passar això al controller */
    try{
        const { name, firstName, lastName, email , password } = req.body  /* TODO: Comprovar aqui la password o al front?  */
        if(!(name && firstName && lastName && email && password)) res.status(400).send("All input are required")
        
        const oldUser = await User.findOne({ email })
        if(oldUser) res.status(409).send("Invalid user")

        encryptedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            displayName,
            firstName,
            lastName,
            email: email.toLowerCase(),
            password:encryptedPassword,
        })

        // Create token
        const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        });
        
        // save user token
        user.token = token;
        res.status(201).json(user).render("profile")
   
   
    }catch{

    }





})


router.get("/login", checkNotAuthenticated, function(req, res) {
    res.render("login");
});



router.post("/login", userControler.newLogin)

router.get("/profile", checkAuthenticated, (req, res) => {
    res.render("profile", { name: req.user.firstName, user: req.user });
});

router.get("/logout", (req, res) => {
    res.clearCookie("session-token");
    res.redirect("/");
});

module.exports = router;