const Place = require('../models/place')


const getPlaces = async (req, res) => {

    if (!req.query.type) {
        res.status(400).json({ "msg": "error" });
    }

    if (req.query.type !== 'parking' && req.query.type !== 'storage') {
        res.status(400).json({ "msg": "error" });
    }

    //Call Database
    const places = await Place.find({ 'active': true })

    var response = [];
    places.forEach(element => {
        if (element['type'] == req.query.type) {
            response.push(element);
        }
    });
    res.json({ 'msg': response });

};


module.exports = { getPlaces }