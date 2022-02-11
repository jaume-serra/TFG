const express = require("express");
const router = express.Router();
const { newLogin, verifyToken, getUser } = require("../controller/main.js");


const bcrypt = require('bcrypt');
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

router.get("/login", checkNotAuthenticated, function(req, res) {
    res.render("login");
});



router.get("/register", checkNotAuthenticated, (req,res) =>{

    res.render("register")
})


router.post("/register", async (req,res) => {

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

router.post("/login", async(req, res) => { 
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
                    return new Error("Error to get Google Access");
                });
        }

       
        const user = await getUser({ email })

        if(user.googleId){
            throw new Error("Invalid parameters")
        }
        console.log('user :>> ', user);
        
        if (user && (await bcrypt.compare(password , user.password))) {
            //User OK --> Crear usuari
            const newToken = jwt.sign({ user_id: user._id, email },
            process.env.TOKEN_KEY, 
            {
                expiresIn: "1h",
            })

            user.token = newToken;
            res.status(200).json(user).render("profile");
        }
        
        res.status(400).send("Invalid Credentials or User")
    
    } catch (err) {
        console.log('err :>> ', err);
        res.redirect("/")

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