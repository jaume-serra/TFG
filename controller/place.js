const { Error } = require('mongoose');
//BBDD
const Place = require('../models/place')


//Maps api
const NodeGeocoder = require('node-geocoder');

//Images to S3
const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)
const crypto = require('crypto');

const options = {
    provider: 'google',

    // Optional depending on the providers
    apiKey: process.env.GOOGLE_GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);



const postCreatePlace = async (req, res) => {
    //Guardem espai i després fotos de l'espai
    const { title, description, measures, price, address } = req.body;
    const user = req.user.email
    const images = []

    try {
        //Buscar info direccio
        const mapsInfo = await geocoder.geocode(address);
        const { latitude, longitude, country, countryCode, zipcode, city } = mapsInfo[0];



        //Guardar imatge a S3
        const folderId = crypto.randomBytes(20).toString('hex')
        const folderPath = `spaceImages/${folderId}`

        for (const file of req.files) {
            const newImage = await uploadFile(file, folderPath)
            await unlinkFile(file.path)
            images.push(newImage.Location)
        }

        //Crear lloc a mongodb
        const newPlace = new Place({
            email: user,
            title,
            description,
            measures,
            price,
            images,
            address,
            lat: latitude,
            lng: longitude,
            country,
            countryCode,
            zipcode,
            city
        })
        newPlace.save()
        res.render("place/create_place")

    } catch (err) {
        res.send(err)
        console.log('err :>> ', err);
    }
}


module.exports = { postCreatePlace }