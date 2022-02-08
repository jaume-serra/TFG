const express = require('express')
const router = express.Router()
const  { verifyToken }  = require('../controller/main.js')

const dotenv = require("dotenv");
dotenv.config({ path: './config/config.env' });



//@Desc pagina principal
//@route  /

//Connect ddbb



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
    
    verifyToken(token).then(() => {
        console.log("success")
        res.cookie('session-token', token);
        res.send('success');
        
    })
    .catch(() => {
        return (new Error("Error al agafar la sessio"))
    });


});

router.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile', /* { name: req.user.firstName, user: req.user } */);
})



router.get('/logout', (req, res) => {
    res.clearCookie('session-token')
    res.redirect('/')
})





module.exports = router