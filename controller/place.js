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
    var email1 = req.locals;
    console.log(email1)
    //Guardar imatge a S3
    const images = []
    try {
        for (const file of req.files) {
            //folderPath es el id del espai 
            const folderPath = 'images'
            //const newImage = await uploadFile(file,folderPath)
            await unlinkFile(file.path)
            //images.push(newImage.Location)
        }
    } catch (err) {
        res.send(err)
        console.log('err :>> ', err);
    }

    //Crear lloc a mongodb
    console.log(images)

    /* const place = await Place.create({
        email: 'jaumeserra@gmail.com',
        address: 'mastrullas',
        lat:-10,
        lng: 100,
        images
    }) */
    res.render("place/create_place")
}




module.exports = { postCreatePlace }