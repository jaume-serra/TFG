
const { OAuth2Client } = require('google-auth-library');
const { Error } = require('mongoose');
const client = new OAuth2Client(process.env.CLIENT_ID);

//DDBB
const User = require('../models/users')
const connectDB = require('../config/db');
connectDB()



/* Verifica el token que rep i retorna l'usuari */
async function verifyToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
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
    if(!newUser) return new Error("Error al comprovar token")
    return newUser
}

 
/* crida la funcio verifyToken i comprova si l'usuari existeix i sinó, en crea un */
async function newLogin(token){
    verifyToken(token)
    .then(async (newUser) => {
        try{

            let user = await User.findOne({email: newUser.email})
            if(user == null){
                user = await User.create(newUser)
            }
        }catch(err){
            console.error()
        }
    })


}


module.exports = { newLogin, verifyToken }