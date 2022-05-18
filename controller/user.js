

const User = require('../models/users')
const bcrypt = require('bcrypt');

//Images to S3
const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)
const crypto = require('crypto');
const { getUserToRequest } = require('./auth');
const { auth } = require('google-auth-library');






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
        return res.render("user/profile", { 'msg': 'Perfil actualitzat correctament', 'valid': true })


    } catch (err) {
        console.log(err)
        return res.render("user/profile", { 'msg': err, 'error': true })

    }

}





module.exports = { getProfile, postProfile }