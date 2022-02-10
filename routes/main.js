const express = require("express");
const router = express.Router();
const { newLogin, verifyToken, getUser } = require("../controller/main.js");

const dotenv = require("dotenv");
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

router.get("/login", checkNotAuthenticated, function(req, res) {
    res.render("login");
});

router.post("/login", async(req, res) => { /* FIXME: Falta afegir el middleware  */
    console.log('req.body :>> ', req.body);
    try {
        const { email, password, token } = req.body;
        if ((!(email && password)) && (!token)) {
            res.status(400).send("Invalid Input");
        }

        if (token) {
            newLogin(token)
                .then(() => {
                    res.cookie("session-token", token);
                    res.status(200).send("success");
                })
                .catch(() => {
                    return new Error("Error al agafar la sessió amb Google");
                });
        }

        const user = await getUser({ email })

        /* TODO: Falta la lògica del login i continuar amb registre */

        res.redirect("/")

    } catch (err) {
        console.log('err :>> ', err);

    }


});

router.get("/profile", checkAuthenticated, (req, res) => {
    res.render("profile", { name: req.user.firstName, user: req.user });
});

router.get("/logout", (req, res) => {
    res.clearCookie("session-token");
    res.redirect("/");
});

module.exports = router;