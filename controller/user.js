

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
        return res.render("user/spaceRent", { "places": places })
    } catch (err) { console.log(err) }
}


const postStopRent = async (req, res) => {

    const { id, email } = req.body
    try {
        const place = await Place.findById(id)
        if (!place) {
            throw ("Error! Espai no dispobile")
        }

        await Place.findByIdAndUpdate({ '_id': id }, { 'renter': '' })
        const places = await Place.find({ 'renter': req.user.email })

        msg = "Espai eliminat correctament"
        console.log(msg)
        //TODO: Acabar això
        return res.render("user/spaceRent", { 'msg': msg, 'places': places })

    } catch (error) {
        const places = await Place.find({ 'renter': req.user.email })
        return res.render("user/spaceRent", { 'msg': error, "error": true, 'places': places })

    }



}

module.exports = { getProfile, postProfile, getSpaceRent, postStopRent }