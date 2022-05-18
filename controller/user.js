

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




module.exports = { getProfile }