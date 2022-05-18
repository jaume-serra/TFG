

const User = require('../models/users')

//Images to S3
const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)
const crypto = require('crypto');






//@GET Profile
const getProfile = (req, res) => {
    try {
        res.render("user/profile")
    } catch (err) { console.log(err) }
}

//@POST Profile
const postProfile = async (req, res) => {
    const { displayName, phone, email, password, newPassword } = req.body;
    const images = []

    try {
        const user = await User.findOne({ 'email': "hola" })






    } catch (err) {

    }

}





module.exports = { getProfile, postProfile }