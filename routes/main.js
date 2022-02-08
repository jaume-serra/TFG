const express = require('express')
const router = express.Router()
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const dotenv = require("dotenv");
dotenv.config({ path: './config/config.env' });


const User = require('../models/users')

//@Desc pagina principal
//@route  /

//Connect ddbb
//DDBB

const connectDB = require('../config/db');
connectDB()



const checkAuthenticated = (req, res, next) => {

    let token = req.cookies['session-token']
    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        })
        const payload = ticket.getPayload()
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;

    }
    verify()
        .then(() => {
            req.user = user;

            next()
        })
        .catch(err => {
            res.redirect('/login')
        })
}


router.get("/", (req, res) => {
    res.render('index')

});


router.all("/mapa", (req, res) => {
    res.render("mapa.ejs", {});
});



// TODO: Mirar quin tipus d'usuari és i si esta loggejat per accedir al login
router.get("/login", function(req, res) { 
    res.render("login");
});



router.post("/login", (req, res) => {

    //Canviar aixo a MVC
    let token = req.body.token;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });

        const payload = ticket.getPayload();
        let newUser = {
            googleId: payload["sub"],
            displayName: payload["name"],
            email: payload["email"],
            firstName: payload["given_name"],
            lastName: payload["family_name"],
            image: payload["picture"]
        }
        try{
            let user = await User.findOne({email: payload["email"]})
            if(user == null){
                user = await User.create(newUser)
            }
        } catch(err){
            console.error()
        }

        
    }

    verify()
        .then(() => {
            res.cookie('session-token', token);
            res.send('success');
        })
        .catch(console.error);



});

router.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile', { name: req.user.firstName, user: req.user });
})



router.get('/logout', (req, res) => {
    res.clearCookie('session-token')
    res.redirect('/')
})





module.exports = router