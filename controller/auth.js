const { OAuth2Client } = require('google-auth-library');
const { Error } = require('mongoose');
const client = new OAuth2Client(process.env.ID_EMAIL);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//DDBB
const User = require('../models/users')
const connectDB = require('./db');
connectDB()

//Send email
const { sendEmail } = require('./sendEmail')

//Check password
const { passwordStrength } = require('check-password-strength')



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


/* Comprova si l'usuari està loggejat com admin  */
const checkAuthenticatedAdmin = async (req, res, next) => {
    let token = {
        "defaultToken": req.cookies["session-token-default"],
        "googleToken": req.cookies["session-token"]
    };

    try {
        const user = await verifyToken(token)
        if (user.role == "admin") {
            res.locals.user = user;
            req.user = user;
            return next()
        }
        throw ("Usuari no vàlid")
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
            if (req.cookies["session-token"]) res.clearCookie("session-token")
            if (req.cookies["session-token-default"]) res.clearCookie("session-token-default")
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
    res.render("main/login", { 'hide': true, 'msg': false })
}


//POST Login

const loginUser = async (email, password) => {
    // Comprovem que existeixi i que les dades siguin vàlides i creem token
    if (!(email && password)) return false
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            {
                user_id: user._id,
                email,
                displayName: user.displayName,
                firstName: user.firstName,
                image: user.image,
                role: user.role == "admin" ? "admin" : "user"
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
    verifyToken(token) //Verifiquem el token
        .then(async (newUser) => {
            try {
                //Comprovem si existeix l'usuari i sinó en creem un
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
            //Cridem a la funció loginGoogle per verificar el token i l'usuari
            loginGoogle({ "googleToken": token })
                .then(() => {
                    // Creem la cookie de sessió per guardar el token i retornem succes al frontend
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
        if (!user) {
            let error = "L'usuari o la contrasenya no són vàlids"
            return res.render("main/login", { 'error': error, 'msg': true, 'hide': false })
        }
        else {
            // Guardem el token com a cookie de sessió i redirigim al profile
            res.cookie("session-token-default", user.token)
            if (req.query.next) {
                if (req.query.lng) {
                    return res.status(200).redirect(req.query.next + "&lng=" + req.query.lng)
                }
                return res.status(200).redirect(req.query.next)
            }
            res.status(200).redirect("/user/profile")
        }

    } catch (err) {
        return res.render("main/login", { 'error': err, 'msg': true, 'hide': false })
    }
}

const getRegister = (req, res) => {
    res.render("main/register")
}



const postRegister = async (req, res) => {

    try {
        const { firstName, secondName, email, password, passwordRepeat, phone } = req.body
        if (!(secondName && firstName && email && password && passwordRepeat && phone)) res.status(400).send("All input are required")

        // omprovem que no existeixi l'usuari
        const oldUser = await User.findOne({ email })
        if (oldUser) {
            res.status(409)
            return res.redirect("main/login", { 'hide': true })
        }
        // Comprovem si la password és forta
        if (passwordStrength(password).id < 2) {
            return res.render("main/register", { 'passwordWeak': true })
        }

        // Encriptem la contrasenya i creem l'usuari
        encryptedPassword = await bcrypt.hash(password, 10)
        const displayName = `${firstName} ${secondName}`
        const user = await User.create({
            displayName,
            firstName,
            lastName: secondName,
            email: email.toLowerCase(),
            password: encryptedPassword,
            phone: phone
        })

        // Creem el token de l'usuari
        const token = jwt.sign(
            {
                user_id: user._id,
                email,
                firstName: user.firstName,
                image: user.image,
                displayName,
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            });

        // Guardem el user token
        user.token = token;
        res.cookie("session-token-default", user.token)

        // Enviem correu a l'administrador
        const mailData = {
            from: process.env.USER_EMAIL,
            to: process.env.USER_EMAIL,
            subject: 'Usuari nou a la plataforma',
            html:
                `<h3>Usuari nou </h3>
            <p>L'usuari ${displayName} acaba de registrar-se a la plataforma.
            <br/>El seu Email: ${email} </br>
        
            <br/>Moltes gràcies, equip getKeepers.</p>
            `
        }
        await sendEmail(mailData)
       
        res.redirect('user/profile')

    } catch (err) {
        /* TODO: acabar aixo */
        console.log('err :>> ', err);
    }

}



const getForgotPassword = async (req, res) => {
    res.render('main/forgotPassword', { 'hide': true, 'msg': false, 'error': false })
}
const postForgotPassword = async (req, res) => {
    const { email, repEmail } = req.body
    try {
        if (email != repEmail) throw ("Els correus no coincideixen")
        const newPassword = Math.random().toString(36).slice(-8)
        encryptedPassword = await bcrypt.hash(newPassword, 10)
        await User.findOneAndUpdate({ 'email': email }, { 'password': encryptedPassword })
        const mailData = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Sol·licitud de nova contrasenya',
            html:
                `<h3>Nova contrasenya </h3>
            <p>Benvolgut, has sol·licitat un canvi de contrasenya.
            <br/>A continuació, la nova contrasenya actual: </br>
            
            <b>${newPassword}</b>

            Qualsevol cosa, posa't amb contacte amb nosaltres.
            <br/>Moltes gràcies, equip getKeepers.</p>
            `
        }
        await sendEmail(mailData)
        return res.render('main/forgotPassword', { 'hide': false, 'msg': `S'ha enviat el correu electrònic correctament`, 'error': false })


    } catch (error) {
        console.log(error)
        return res.render('main/forgotPassword', { 'hide': false, 'msg': error, 'error': true })
    }
}

const postContact = async (req, res) => {
    const { name, email, phone, message } = req.body
    try {

        const mailData = {
            from: process.env.USER_EMAIL,
            to: process.env.USER_EMAIL,
            subject: `Missatge de l'usuari ${name}`,
            html:
                `<h3>Missatge </h3>
            <p>L'usuari ${name} amb les següents dades: 
            <br>
            <br>
            - Email: ${email}
            <br>
            - Phone: ${phone}
            <br>
            <br>
            T'ha enviat el missatge següent:
            <br>
            ${message}
            `
        }
        await sendEmail(mailData)
        return res.render('main/contact', { 'hide': false, 'msg': `S'ha enviat el correu electrònic correctament`, 'error': false })

    } catch (error) {
        return res.render('main/contact', { 'hide': false, 'msg': error, 'error': true })
    }




}


module.exports = { getLogin, postLogin, getRegister, postRegister, checkAuthenticated, checkAuthenticatedAdmin, checkNotAuthenticated, getUserToRequest, getForgotPassword, postForgotPassword, postContact }