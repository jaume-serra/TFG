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
const checkAuthenticated = async (req, res, next) => {
    let token = {
        "defaultToken": req.cookies["session-token-default"],
        "googleToken": req.cookies["session-token"]
    };

    try {
        const user = await verifyToken(token)
        res.locals.user = user;
        req.user = user;
        return next()

    } catch {
        res.redirect(`/login?next=${req.originalUrl}`)
    }
};

/* Comprova si l'usuari no està loggejat */

const checkNotAuthenticated = (req, res, next) => {
    let token = {
        "defaultToken": req.cookies["session-token-default"],
        "googleToken": req.cookies["session-token"]
    };
    if (!(token["defaultToken"]) && !(token["googleToken"])) {
        next();
        return
    }

    verifyToken(token)
        .then((user) => {
            req.user = user;
            res.locals.user = user;
            res.redirect("/")
        })
        .catch((err) => {
            console.log('err :>> ', err);
            res.redirect("/")
        });
};

/* Afegir usuari a la request */

const getUserToRequest = (req, res, next) => {
    let token = {
        "defaultToken": req.cookies["session-token-default"],
        "googleToken": req.cookies["session-token"]
    };
    if (!(token["defaultToken"]) && !(token["googleToken"])) {
        next();
        return
    }

    verifyToken(token)
        .then((user) => {
            res.locals.user = user;
            req.user = user;
            next()
        })
        .catch((err) => {
            next()
        })
}

/* Verifica el token que rep i retorna l'usuari */
const verifyToken = async (token) => {
    /* Rep:
        "defaultToken": req.cookies["session-token-default"],
        "googleToken" : req.cookies["session-token"]
    */
    let newUser;
    if (token["googleToken"]) {
        try {
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
        } catch (err) {
            throw new Error(err)

        }

    }
    else if (token["defaultToken"]) {
        try {
            jwt.verify(token["defaultToken"], process.env.TOKEN_KEY, (err, authData) => {
                if (err) throw new Error("Error al comprovar token")
                else newUser = authData
            })
        } catch (err) {
            throw new Error(err)
        }

    }

    if (!newUser) throw new Error("Error al comprovar token")
    return newUser
}

//GET Login

const getLogin = (req, res) => {
    res.render("main/login")
}


//POST Login

const loginUser = async (email, password) => {
    if (!(email && password)) return false
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {

        const token = jwt.sign(
            {
                user_id: user._id,
                email,
                firstName: user.firstName,
                image: user.image
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // save user token
        user.token = token;
        return user

    }
    else {
        return false
    }
}

//Funcio cridada quan l'usuari vol iniciar amb token
const loginGoogle = async (token) => {
    verifyToken(token)
        .then(async (newUser) => {
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




const postLogin = async (req, res, next) => {
    try {
        const { email, password, token } = req.body
        /* Login with Google */
        if (token) {
            /* Pot rebre token i tenir sessio? En teoria no*/

            loginGoogle({ "googleToken": token })
                .then(() => {
                    if (!req.cookies["session-token"]) {
                        res.cookie("session-token", token);
                    }
                    res.status(200).send("success");
                    return

                })
                .catch(() => {
                    throw new Error("Error to get Google Access");
                })
            return
        }

        /* Login normal */

        const user = await loginUser(email, password)
        console.log('user :>> ', user);
        if (!user) {
            res.status(400).send("Invalid user or password")
        }
        else {
            res.cookie("session-token-default", user.token)
            console.log(req.query)
            if (req.query.next) {
                res.status(200).redirect(req.query.next)
                return
            }
            res.status(200).redirect("/profile")
        }


    } catch (err) {
        console.log('err :>> ', err)
        res.status(400).send(err)
    }
}

const getRegister = (req, res) => {
    res.render("main/register") //FIXME: {user:req.user}
}



const postRegister = async (req, res) => {

    try {
        const { firstName, secondName, email, password, passwordRepeat } = req.body
        if (!(secondName && firstName && email && password && passwordRepeat)) res.status(400).send("All input are required")

        const oldUser = await User.findOne({ email })
        if (oldUser) {
            res.status(409)
            return
        }
        encryptedPassword = await bcrypt.hash(password, 10)
        const displayName = `${firstName} ${secondName}`
        const user = await User.create({
            displayName,
            firstName,
            lastName: secondName,
            email: email.toLowerCase(),
            password: encryptedPassword,
        })

        // Create token
        const token = jwt.sign(
            {
                user_id: user._id,
                email,
                firstName: user.firstName,
                image: user.image,
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            });

        // save user token
        user.token = token;
        res.cookie("session-token-default", user.token)
        res.status(201).render("profile", { user })


    } catch (err) {
        /* TODO: acabar aixo */

        console.log('err :>> ', err);
    }

}

module.exports = { getLogin, postLogin, getRegister, postRegister, checkAuthenticated, checkNotAuthenticated, getUserToRequest }