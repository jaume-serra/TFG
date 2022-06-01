

const User = require('../models/users')
const Place = require('../models/place')


//URL parsing
const url = require('url')


const bcrypt = require('bcrypt');

//Images to S3
const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)


//Send email
const { transporter } = require('./sendEmail')

//QR
const qrcode = require('qrcode');
const { userInfo } = require('os');


//@GET Profile
const getProfile = (req, res) => {
    try {
        res.render("user/profile", { 'hide': false, 'msg': false, 'error': false })
    } catch (err) { console.log(err) }
}

//@POST Profile
const postProfile = async (req, res) => {
    const { displayName, phone, email, password, newPassword } = req.body;
    const file = req.file;

    try {
        const user = await User.findOne({ 'email': email })

        //Comprovem user
        if (!user) {
            throw ('Usuari no vàlid')
        }
        //Canvi password
        if ((password != "") && (newPassword != "")) {
            if (password !== newPassword) {
                throw ("Les contrasenyes no coincideixen")
            }

            encryptedPassword = await bcrypt.hash(password, 10)
            await User.findOneAndUpdate({ 'email': email }, {
                'password': encryptedPassword
            })
        }

        //Actualitzem foto perfil
        if (file) {
            const folderId = user._id.toString()
            const folderPath = `profileImages/${folderId}`
            const newImage = await uploadFile(file, folderPath)
            await unlinkFile(file.path)
            await User.findOneAndUpdate({ 'email': email },
                {
                    'image': newImage.Location
                })
        }
        if (displayName) {
            await User.findOneAndUpdate({ 'email': email },
                {
                    displayName
                })
        }
        if (phone) {
            await User.findOneAndUpdate({ 'email': email },
                {
                    phone
                })
        }
        return res.render("user/profile", {
            'msg': 'Perfil actualitzat correctament. Torna a inciciar sessió per validar els canvis', 'error': false, 'hide': false
        })


    } catch (err) {
        console.log(err)
        return res.render("user/profile", { 'msg': err, 'error': true, 'hide': false })

    }

}



//@GET spaceRent 
const getSpaceRent = async (req, res) => {
    try {
        const places = await Place.find({ 'renter': req.user.email })
        let userInfo = []
        userInfo = generateUserInfo(places)
        return res.render("user/spaceRent", { "places": places, 'userInfo': userInfo, 'hide': true })
    } catch (err) { console.log(err) } //TODO:ACABAR AIXO
}
//@POST spaceRent 

const postStopRent = async (req, res) => {

    const { id } = req.body
    let userInfo = []

    try {
        const place = await Place.findById(id)
        if (!place) {
            throw ("Error! Espai no dispobile")
        }

        await Place.findByIdAndUpdate({ '_id': id }, { 'renter': '' })
        const places = await Place.find({ 'renter': req.user.email })
        userInfo = generateUserInfo(places)
        const msg = "Espai eliminat correctament"
        return res.render("user/spaceRent", { 'msg': msg, 'places': places, 'hide': false, 'userInfo': userInfo })

    } catch (error) {
        const places = await Place.find({ 'renter': req.user.email })
        userInfo = generateUserInfo(places)
        return res.render("user/spaceRent", { 'msg': error, "error": true, 'places': places, 'hide': false, 'userInfo': userInfo })

    }



}


const getMySpaces = async (req, res) => {
    /* Informació pis i llogater  */
    const { email } = req.user;
    try {
        if (!email) {
            throw "Invalid user"
        }
        const places = await Place.find({ 'email': email })
        let renterInfo = []
        renterInfo = await generateRenterInfo(places)

        return res.render("user/mySpaces", { "places": places, 'renterInfo': renterInfo, 'hide': true })

    } catch (error) {
        const places = await Place.find({ 'email': email })
        return res.render('user/mySpaces', { 'msg': error, "error": true, 'places': places, 'hide': false })
    }
}


const postStopRentPlace = async (req, res) => {
    /*
       - Mirar que existeixi
       - Agafar llogater actual i enviar correu
       - Eliminar llogater de la bbdd
    */

    const { id } = req.body
    const { email } = req.user;
    let renterInfo = []

    try {
        const place = await Place.findById(id)
        if (!place) {
            throw ("Error! Espai no dispobile")
        }

        if (!place.renter) {
            throw ("L'espai no està llogat actualment")
        }
        const mailData = {
            from: process.env.USER_EMAIL,
            to: place.renter,
            subject: 'Cancel·lació del lloger per part del propietari',
            html:
                `<h2>Cancel·lació del lloger</h2>
            <p>Benvolgut, el propietari ha acabat amb el lloger de l'espai: ${place.title}.<br/>Qualsevol cosa, posa't amb contacte amb el propietari :<br/> ${email} <br/> Moltes gràcies, equip Releaser </p>
            `
        }
        await transporter.sendMail(mailData)

        await Place.findByIdAndUpdate({ '_id': id }, { 'renter': '' })
        const places = await Place.find({ 'email': email })
        renterInfo = await generateRenterInfo(places)

        const msg = "Lloguer anul·lat correctament"
        return res.render("user/mySpaces", { "places": places, 'renterInfo': renterInfo, 'hide': false, 'msg': msg, 'error': false })


    } catch (error) {
        const places = await Place.find({ 'email': email })
        renterInfo = await generateRenterInfo(places)

        return res.render('user/mySpaces', { 'msg': error, 'error': true, 'places': places, 'hide': false, 'renterInfo': renterInfo })
    }
}

const postDeleteSpace = async (req, res) => {
    /*
        - Mirar que existeixi
        - Comprovar que no tingui llogater
        - Eliminar espai de la bbdd
   */
    const { id } = req.body
    const { email } = req.user;
    let renterInfo = []

    try {
        const place = await Place.findById(id)
        if (!place) {
            throw ("Error! Espai no dispobile")
        }

        if (place.renter) {
            throw ("Primer has d'anul·lar el lloger abans d'eliminar-lo")
        }

        await Place.findByIdAndRemove({ '_id': id })
        const places = await Place.find({ 'email': email })
        renterInfo = await generateRenterInfo(places)

        const msg = "Espai eliminat correctament"
        return res.render("user/mySpaces", { "places": places, 'renterInfo': renterInfo, 'hide': false, 'msg': msg, 'error': false })

    } catch (error) {
        const places = await Place.find({ 'email': email })
        renterInfo = await generateRenterInfo(places)

        return res.render('user/mySpaces', { 'msg': error, 'error': true, 'places': places, 'hide': false, 'renterInfo': renterInfo })
    }
}


const postGenerateQR = async (req, res) => {
    /*
        - Comprovar que no tingui cap renter l'espai
        - Generar url aleatoria per cada espai
        - Generar qr
        - Afegir renter a la bbdd
    */
    const { id } = req.body;
    const { email } = req.user;
    let renterInfo = []

    try {
        const place = await Place.findById(id)
        if (place.renter) {
            throw (`L'espai ja està llogat`)
        }
        //URL: :idplace/rentKey
        /*
            -Generar key aleatoria
            -Guardar-la taula espai
            -Generar qr
            -Al fer get :idplace/rentKey
                - Afegir renter
                - Eliminar rentKey
        */
        const rentKey = Math.random().toString(36).slice(-10)
        await Place.findByIdAndUpdate({ '_id': id }, { 'rentKey': rentKey })
        const urlFor = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: `place/${id}/${rentKey}`
        });
        const qr = await qrcode.toDataURL(urlFor)

        const places = await Place.find({ 'email': email })
        renterInfo = await generateRenterInfo(places)
        console.log(urlFor)
        return res.render("user/mySpaces", { "places": places, 'renterInfo': renterInfo, 'hide': false, 'msg': false, 'error': false, 'code': qr })

    } catch (error) {
        //TODO: Acabar aixo
        console.log(error)
    }

}

const generateRenterInfo = async (places) => {
    let renterInfo = []
    for (let i = 0; i < places.length; i++) {
        const renter = await User.findOne({ 'email': places[i].renter })
        if (!renter) {
            var info = { 'email': '', 'displayName': '', 'phone': '' }

        } else {
            var info = { 'email': renter.email, 'displayName': renter.displayName, 'phone': renter.phone }
        }
        renterInfo.push(info)
    }
    return renterInfo
}

const generateUserInfo = async (places) => {
    let userInfo = []
    for (let i = 0; i < places.length; i++) {
        const user = await User.findOne({ 'email': places[i].email })
        var info = { 'email': user.email, 'displayName': user.displayName, 'phone': user.phone }
        userInfo.push(info)
    }
    return userInfo

}
module.exports = { getProfile, postProfile, getSpaceRent, postStopRent, getMySpaces, postStopRentPlace, postDeleteSpace, postGenerateQR }