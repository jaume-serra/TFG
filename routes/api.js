const { response } = require('express');
const express = require('express');
const Place = require('../models/place')

let router = express.Router();

router.get('/get_places', async (req, res) => {

    if (!req.query.type) {
        res.status(400).json({ "msg": "error" });
    }

    if (req.query.type !== 'parking' && req.query.type !== 'storage') {
        res.status(400).json({ "msg": "error" });
    }

    //Call Database
    const places = await Place.find({ available: true }) //FIXME: afegir active

    var response = [];
    places.forEach(element => {
        if (element['type'] == req.query.type) {
            response.push(element);
        }
    });
    res.json({ 'msg': response });

});



//Todo: Tokensigin function




module.exports = router;