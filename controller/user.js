

const User = require('../models/users')
const Place = require('../models/place')



const bcrypt = require('bcrypt');

//Images to S3
const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)





//@GET Profile
const getProfile = (req, res) => {
    try {
        res.render("user/profile")
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
            throw 'Usuari no vàlid'
        }
        //Canvi password
        if ((password != "") && (newPassword != "")) {
            if (password !== newPassword) {
                throw "Les contrasenyes no coincideixen"
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
        //TODO: Acabar aixo
        return res.render("user/profile", { 'msg': 'Perfil actualitzat correctament', 'valid': true })


    } catch (err) {
        console.log(err)
        //TODO: Acabar aixo
        return res.render("user/profile", { 'msg': err, 'error': true })

    }

}



//@GET spaceRent 
const getSpaceRent = async (req, res) => {
    try {
        const places = await Place.find({ 'renter': req.user.email })
        let userInfo = []
        for (let i = 0; i < places.length; i++) {
            const user = await User.findOne({ 'email': places[i].email })
            var info = { 'email': user.email, 'displayName': user.displayName, 'phone': user.phone }
            userInfo.push(info)
        }
        return res.render("user/spaceRent", { "places": places, 'userInfo': userInfo, 'hide': true })
    } catch (err) { console.log(err) }
}

const postStopRent = async (req, res) => {

    const { id } = req.body
    try {
        const place = await Place.findById(id)
        if (!place) {
            throw ("Error! Espai no dispobile")
        }

        await Place.findByIdAndUpdate({ '_id': id }, { 'renter': '' })
        const places = await Place.find({ 'renter': req.user.email })
        let userInfo = []
        for (let i = 0; i < places.length; i++) {
            const user = await User.findOne({ 'email': places[i].email })
            var info = { 'email': user.email, 'displayName': user.displayName, 'phone': user.phone }
            userInfo.push(info)
        }
        const msg = "Espai eliminat correctament"
        //TODO: Acabar això
        return res.render("user/spaceRent", { 'msg': msg, 'places': places, 'hide': false, 'userInfo': userInfo })

    } catch (error) {
        const places = await Place.find({ 'renter': req.user.email })
        let userInfo = []
        for (let i = 0; i < places.length; i++) {
            const user = await User.findOne({ 'email': places[i].email })
            var info = { 'email': user.email, 'displayName': user.displayName, 'phone': user.phone }
            userInfo.push(info)
        }
        return res.render("user/spaceRent", { 'msg': error, "error": true, 'places': places, 'hide': false, 'userInfo': userInfo })

    }



}


const getMySpaces = async (req, res) => {
    /* Informació pis i llogater  */
    //TODO: ACABAR AIXO
    const { email } = req.user;
    try {
        if (!email) {
            throw "Invalid user"
        }
        const places = await Place.find({ 'email': email })
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
        return res.render("user/mySpaces", { "places": places, 'renterInfo': renterInfo, 'hide': true })

    } catch (error) {
        const places = await Place.find({ 'email': email })
        return res.render('user/mySpaces', { 'msg': error, "error": true, 'places': places, 'hide': false })
    }
}


const postStopRentPlace = async (req, res) => {
    const { id } = req.body
    const { email } = req.user;
    let renterInfo = []

    try {
        const place = await Place.findById(id)
        if (!place) {
            throw ("Error! Espai no dispobile")
        }
        /*
        - Mirar que existeixi
        - Agafar llogater actual i enviar correu
        - Eliminar llogater de la bbdd
        */
        if (!place.renter) {
            throw ("L'espai no està llogat actualment")
        }

        //TODO:enviar correu

        await Place.findByIdAndUpdate({ '_id': id }, { 'renter': '' })
        const places = await Place.find({ 'email': email })
        for (let i = 0; i < places.length; i++) {
            const renter = await User.findOne({ 'email': places[i].renter })
            if (!renter) {
                var info = { 'email': '', 'displayName': '', 'phone': '' }

            } else {
                var info = { 'email': renter.email, 'displayName': renter.displayName, 'phone': renter.phone }
            }
            renterInfo.push(info)

        }
        const msg = "Lloguer anul·lat correctament"
        return res.render("user/mySpaces", { "places": places, 'renterInfo': renterInfo, 'hide': false, 'msg': msg, 'error': false })


    } catch (error) {
        const places = await Place.find({ 'email': email })
        for (let i = 0; i < places.length; i++) {
            const renter = await User.findOne({ 'email': places[i].renter })
            if (!renter) {
                var info = { 'email': '', 'displayName': '', 'phone': '' }

            } else {
                var info = { 'email': renter.email, 'displayName': renter.displayName, 'phone': renter.phone }
            }
            renterInfo.push(info)
        }
        return res.render('user/mySpaces', { 'msg': error, 'error': true, 'places': places, 'hide': false, 'renterInfo': renterInfo })
    }
}

const postDeleteSpace = async (req, res) => {
    const { id } = req.body
    const { email } = req.user;
    let renterInfo = []

    try {
        const place = await Place.findById(id)
        if (!place) {
            throw ("Error! Espai no dispobile")
        }
        /*
        - Mirar que existeixi
        - Comprovar que no tingui llogater
        - Eliminar espai de la bbdd
        */
        if (place.renter) {
            throw ("Primer has d'anul·lar el lloger abans d'eliminar-lo")
        }

        await Place.findByIdAndRemove({ '_id': id })
        const places = await Place.find({ 'email': email })
        for (let i = 0; i < places.length; i++) {
            const renter = await User.findOne({ 'email': places[i].renter })
            if (!renter) {
                var info = { 'email': '', 'displayName': '', 'phone': '' }

            } else {
                var info = { 'email': renter.email, 'displayName': renter.displayName, 'phone': renter.phone }
            }
            renterInfo.push(info)

        }
        const msg = "Espai eliminat correctament"
        return res.render("user/mySpaces", { "places": places, 'renterInfo': renterInfo, 'hide': false, 'msg': msg, 'error': false })

    } catch (error) {
        const places = await Place.find({ 'email': email })
        for (let i = 0; i < places.length; i++) {
            const renter = await User.findOne({ 'email': places[i].renter })
            if (!renter) {
                var info = { 'email': '', 'displayName': '', 'phone': '' }

            } else {
                var info = { 'email': renter.email, 'displayName': renter.displayName, 'phone': renter.phone }
            }
            renterInfo.push(info)
        }
        return res.render('user/mySpaces', { 'msg': error, 'error': true, 'places': places, 'hide': false, 'renterInfo': renterInfo })
    }
}


module.exports = { getProfile, postProfile, getSpaceRent, postStopRent, getMySpaces, postMySpaces, postStopRentPlace, postDeleteSpace }