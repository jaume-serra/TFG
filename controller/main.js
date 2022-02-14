const { OAuth2Client } = require('google-auth-library');
const { Error } = require('mongoose');
const client = new OAuth2Client(process.env.CLIENT_ID);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//DDBB
const User = require('../models/users')
const connectDB = require('../config/db');
connectDB()







/* Comprova si l'usuari està loggejat  */
const checkAuthenticated = (req, res, next) => {
    let token = {
        "defaultToken": req.cookies["session-token-default"],
        "googleToken" : req.cookies["session-token"]
    };

    verifyToken(token)
        .then((user) => {
            req.user = user;
            next();
            return
        })
        .catch((err) => {
            console.log('err veryfit auth :>> ', err);
            res.redirect("/login");
        });
};

/* Comprova si l'usuari no està loggejat */
const checkNotAuthenticated = (req, res, next) => {
    let token = {
        "defaultToken":req.cookies["session-token-default"],
        "googleToken": req.cookies["session-token"]
    };
    if (!(token["defaultToken"] || token["googleToken"])) {
        console.log('(token not auth holas) :>> ', token);
        next();
        return
    }

    verifyToken(token)
        .then((user) => {
            /* FIXME: Passar user?  */
            res.redirect("/profile");
        })
        .catch((err) => {
            console.log('err :>> ', err);
        });
};


/* Verifica el token que rep i retorna l'usuari */
const verifyToken = async(token) => {
    /* Rep:
        "defaultToken": req.cookies["session-token-default"],
        "googleToken" : req.cookies["session-token"]
    */
    let newUser;
    console.log('token verify token funct :>> ', token);

    if(token["googleToken"]){
        const ticket = await client.verifyIdToken({
            idToken: token["googleToken"],
            audience: process.env.CLIENT_ID,
        });
    
        const payload = ticket.getPayload();
         newUser = {
            googleId: payload["sub"],
            displayName: payload["name"],
            email: payload["email"],
            firstName: payload["given_name"],
            lastName: payload["family_name"],
            image: payload["picture"]
        }
    }
    else if(token["defaultToken"]){
        jwt.verify(token["defaultToken"],process.env.TOKEN_KEY, (err,authData) => {
            console.log('authData :>> ', authData);
            if(err) return new Error("Error al comprovar token")
            else newUser = authData
        })
    }
    
    if (!newUser) return new Error("Error al comprovar token")
    return newUser
}

//GET Login

const getLogin = (req,res) => {
    res.render("login")
}


//POST Login

const loginUser = async(email,password) => {
    if(!(email && password)) return false
    const user = await User.findOne({email})
    if (user && (await bcrypt.compare(password, user.password))){
        
        const token = jwt.sign(
            { user_id: user._id, 
                email },
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

//Funcio cridada quan l'usuari vol iniciar amb token
 const loginGoogle = async (token) => {
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




const postLogin = async (req,res) => {
    try{
        const {email, password, token} = req.body
        /* Login with Google */
        if(token){
            /* TODO: Mirar com pot quedar millor aixo */
            /* Pot rebre token i tenir sessio? En teoria no*/

            loginGoogle({"googleToken":token})
             .then(() => {
                if(! req.cookies["session-token"]){
                    res.cookie("session-token", token);
                }
                res.status(200).send("success");
                 
             })
            .catch(() => {
                throw new Error("Error to get Google Access");
            }) 
        }

        /* Login normal */

        const user = await loginUser(email, password)
        
        if(!user){
            res.status(400).send("Invalid user or password")
        }
        else{
            res.cookie("session-token-default",user.token)
            res.status(200).render("profile",{user})
        }


    }catch(err){
        console.log('err :>> ', err)
        res.status(400).send(err)
    }
}

const getRegister = (req,res) => {
    res.render("register")
}



const postRegister = async (req,res) => {

    try{
        const { name, firstName, lastName, email , password } = req.body  
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
        res.cookie("session-token-default",user.token)
        res.status(201).render("profile")
   
   
    }catch{
        /* TODO: acabar aixo */
    }

}

module.exports = { getLogin,postLogin,getRegister, postRegister, checkAuthenticated,checkNotAuthenticated }