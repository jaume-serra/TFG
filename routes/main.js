const express = require('express')
const router = express.Router()
const  { newLogin, verifyToken }  = require('../controller/main.js')

const dotenv = require("dotenv");
dotenv.config({ path: './config/config.env' });



/* Comprova si l'usuari no està loggejat */
const checkNotAuthenticated = (req, res, next) => {
    let token = req.cookies['session-token']
    if(!token){ 
        next()
    }
    verifyToken(token)
    .then((user) => {
        res.redirect("/profile")
    })
    .catch( err => {
        next()
    })


}


/* Comprova si l'usuari està loggejat  */
const checkAuthenticated = (req, res, next) => {

    let token = req.cookies['session-token']
    
    verifyToken(token)
    .then((user) => {
        req.user = user
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



router.get("/login", checkNotAuthenticated, function(req, res) { 
    res.render("login");
});



router.post("/login", checkNotAuthenticated, (req, res) => {

    
    let token = req.body.token;
    
    newLogin(token).then(() => {
        console.log("success")
        res.cookie('session-token', token);
        res.send('success');
        
    })
    .catch(() => {
        return (new Error("Error al agafar la sessio"))
    });


});

router.get('/profile', checkAuthenticated, (req, res) => {
    res.render('profile',  { name: req.user.firstName, user: req.user } );
})



router.get('/logout', (req, res) => {
    res.clearCookie('session-token')
    res.redirect('/')
})



module.exports = router