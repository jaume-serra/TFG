const { Error } = require('mongoose');

const User = require('../models/users')
const Place = require('../models/place')

const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)


const postCreatePlace = async (req, res) => {
    //Guardem espai i després fotos de l'espai
    console.log(req.body);
    const email = req.user
    console.log('email :>> ', email);

    //Guardar imatge a S3
    const images = []
    try{
        for(const file of req.files){
            //folderPath es el id del espai 
            const folderPath = 'images'
            const newImage = await uploadFile(file,folderPath)
            await unlinkFile(file.path)
            images.push(newImage.Location)
        }
    }catch(err){
        res.send(err)
        console.log('err :>> ', err);
    }

    //Save images link to mongodb
    console.log(images)
    res.render("place/create_place")
}




module.exports = { postCreatePlace }