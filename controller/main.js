const { OAuth2Client } = require('google-auth-library');
const { Error } = require('mongoose');
const client = new OAuth2Client(process.env.CLIENT_ID);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
//DDBB
const User = require('../models/users')
const connectDB = require('../config/db');
connectDB()



/* Verifica el token que rep i retorna l'usuari */
const verifyToken = async(token) => {
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
    if (!newUser) return new Error("Error al comprovar token")
    return newUser
}


/* crida la funcio verifyToken i comprova si l'usuari existeix i sinó, en crea un */



const getUser = async ({ email }) =>{
    return await User.findOne({ email })
}


const loginUser = async(email,password) => {
    if(!(email && password)) return false
    const user = await User.findOne({email})
    if (user && (await bcrypt.compare(password, user.password))){
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
        user.token = token;
        return user

    }
    else{
        return false
    }
}

 const loginGoogleUser = async (token) => {

    verifyToken(token)
        .then(async(newUser) => {
            try {

                let user = await User.findOne({ email: newUser.email })
                if (user == null) {
                    user = await User.create(newUser)
                }
            } catch (err) {
                console.error()
            }
        })


}

const newLogin = async (req,res) => {
    try{
        const {email, password, token} = req.body
        if(token){
            /* TODO: Mirar com pot quedar millor aixo */
            loginGoogleUser(token)
            .then(() => {
                res.cookie("session-token", token);
                res.status(200).send("success");
            })
            .catch(() => {
                throw new Error("Error to get Google Access");
            }); 
        }

        const user = await loginUser(email, password)
        
        if(!user){
            res.status(400).send("Invalid user or password")

        }
        else{
            // res.status(200).json(user);
            res.status(200).render("profile",{user})
        }


    }catch(err){
        console.log('err :>> ', err);
        res.status(400).send(err)

    }
}

module.exports = { newLogin,verifyToken } /* TODO: Mirar que cal exportar */