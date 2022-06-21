const { Error } = require('mongoose');
//BBDD
const Place = require('../models/place')
const User = require('../models/users')
const Rating = require('../models/rating')
const Historic = require('../models/historic')


//Send Email
const { sendEmail } = require("./sendEmail")

//Maps api
const NodeGeocoder = require('node-geocoder');

//Images to S3
const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)
const crypto = require('crypto');
// const place = require('../models/place');

// Options for geocoder
const options = {
    provider: 'google',
    // Optional depending on the providers
    apiKey: process.env.GOOGLE_GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);


//@GET create
const getCreatePlace = (req, res) => {
    try {
        res.render("place/create_place")
    } catch (err) { console.log(err) }
}

//@POST create
const postCreatePlace = async (req, res) => {
    //Guardem espai i després fotos de l'espai
   
    const { title, description, measures, price, address, type } = req.body;
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
        await Place.create({
            id: folderId,
            email: user,
            type: type,
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
            city,
            renter: "",
            rentKey: ""
        })
        res.redirect(`${folderId}?lat=${latitude}&lng=${longitude}`)

    } catch (err) {
        res.send(err)
        console.log('err :>> ', err);
    }
}

//@GET /:id
const getPlace = async (req, res) => {
    const id = req.params.id
    try {
        const place = await Place.findOne({ 'id': id })
        const user = await User.findOne({ 'email': place.email })
        const ratings = await Rating.find({ 'idPlace': id })
        if (user.phone) {
            return res.render("place/place", { 'place': place, 'owner': { 'contact': user.phone, 'image': user.image }, 'ratings': ratings })
        }
        return res.render("place/place", { 'place': place, 'owner': { 'contact': user.email, 'image': user.image }, 'ratings': ratings })

    } catch (err) {
        return res.status(404).render("main/error404")
    }
}



//@POST /:id

const postPlace = async (req, res) => {
    const { message, email, star, placeId } = req.body;
    if (!message || !email || !star || !placeId) {
        //TODO: Ensenyar error
        return res.redirect(req.originalUrl)
    }
    try {
        /* Agafem el nombre d'estrelles */
        let starCount = 0;
        star.forEach((element, index) => {
            if (element != "") {
                starCount = index + 1;
            }
        });

        /* Comprovem existencia d'usuari i de l'espai */
        const place = await Place.findOne({ 'id': placeId })
        const user = await User.findOne({ 'email': email })

        if (!user || !place) {
            //TODO: retornar error
            return res.redirect(req.originalUrl)
        }

        // Creem l'entrada a la taula de Ratings
        await Rating.create({
            idPlace: placeId,
            email,
            description: message,
            stars: starCount,
            image: user.image,
            displayName: user.displayName

        })
        return res.redirect(req.originalUrl)


    } catch (error) {
        //TODO: acabar això
        res.send(error)
        console.log(error)
    }
}

const getRentPlace = async (req, res) => {
    const id = req.params.id
    const rentKey = req.params.rentKey
    const emailRenter = req.user.email

    try {
        const place = await Place.findById(id)
        if (place.rentKey != rentKey) {
            return res.status(404).render("main/error404")
        }

        if (emailRenter == place.email) {
            throw ("No pots llogar el teu propi espai")
        }
        //Generem nova clau i guardem el llogater
        const newRentKey = Math.random().toString(36).slice(-10)
        await Place.findByIdAndUpdate({ '_id': id }, { 'renter': emailRenter, 'rentKey': newRentKey })

        //Guardem al històric
        await Historic.create({
            'placeId': place._id,
            'email': place.email,
            'renter': emailRenter
        })

        //Enviem correu electronic
        const mailData = {
            from: process.env.USER_EMAIL,
            to: emailRenter,
            subject: `Val·lidació del lloger del ${place.type == "storage" ? "Traster" : "Pàrking"} `,
            html:
                `<h3>Has llogat el ${place.type == "storage" ? "traster" : "pàrking"} correctament!</h3>
            <p>Benvolgut, s'ha realitzat el lloger de l'espai "${place.title}" correctament.</p><p>Qualsevol cosa, contacte amb el propietari:</p><p>Correu: ${place.email}</p><br><p>Moltes gràcies per confiar amb nosaltres, equip Keepers </p>
            `
        }
        await sendEmail(mailData)

        return res.render("place/rentSuccess", { 'place': place, 'email': emailRenter })
    } catch (error) {
        //TODO: acabar aixo
        console.log(error)
    }


}



const postDeleteRating = async (req, res) => {
    const { id } = req.body
    await Rating.findByIdAndDelete({ '_id': id })
}

module.exports = { getCreatePlace, postCreatePlace, getPlace, postPlace, getRentPlace, postDeleteRating }