
const { OAuth2Client } = require('google-auth-library');
const { Error } = require('mongoose');
const client = new OAuth2Client(process.env.CLIENT_ID);

//DDBB
const User = require('../models/users')
const connectDB = require('../config/db');
connectDB()



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
    try{
        
        let user = await User.findOne({email: payload["email"]})
        if(user == null){
            user = await User.create(newUser)
        }
    } catch(err){
        console.error()
    }

    
}

 


module.exports = {verifyToken}