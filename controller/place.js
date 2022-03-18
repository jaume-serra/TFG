const { Error } = require('mongoose');
const User = require('../models/users')
const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)


const postCreatePlace = async (req, res) => {
console.log(req.files)

    for(const file of req.files){
        try{
            const result = await uploadFile(file)
            await unlinkFile(file.path)
        }catch(err){
            console.log('err :>> ', err);
        }
    }
    res.render("place/create_place")
}




module.exports = { postCreatePlace }