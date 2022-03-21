const { response } = require('express');
const express = require('express');
// const { route } = require('express/lib/application');
let router = express.Router();


/* router.all('/customers', (req,res) =>{
    var customer = [{"id":"1","h":"2"}];
    res.send(customer);


}) */


router.get('/get_places', (req, res) => {

    if (!req.query.type) {
        res.status(400).json({ "msg": "error" });
    }

    if (req.query.type !== 'parking' && req.query.type !== 'storage') {
        res.status(400).json({ "msg": "error" });
    }


    //Call Database
    places = [{ "id": '1', "type": "parking", "title": "Apartament Jaume", "description": "Lorem ipsum dolor sit amet, consectetur.", "mides": "30 m2", "preu": "40", "img": ["/public/img/a1.jpg"], "lat": "41.790914", "long": "1.995634" },
    { "id": '2', "type": "storage", "title": "Apartament Manel", "description": "Lorem ipsum dolor sit amet, consectetur.", "mides": "150 m2", "preu": "400", "img": ["/public/img/a2.jpg"], "lat": "41.391205", "long": "2.154107" },
    { "id": '24', "type": "storage", "title": "Apartament Ramon", "description": "Lorem ipsum dolor sit amet, consectetur.", "mides": "2000 m2", "preu": "4000", "img": ["/public/img/a3.jpg"], "lat": "41.390405", "long": "2.154807" },

    { "id": '3', "type": "storage", "title": "Apartament Ramon", "description": "Lorem ipsum dolor sit amet, consectetur.", "mides": "240 m2", "preu": "2000", "img": ["/public/img/a3.jpg", "/public/img/a1.jpg", "/public/img/a3.jpg", "/public/img/a2.jpg"], "lat": "41.390005", "long": "2.154077" },
    { "id": '4', "type": "storage", "title": "Apartament Joan", "description": "Lorem ipsum dolor sit amet, consectetur.", "mides": "200 m2", "preu": "1000", "img": ["/public/img/a1.jpg", "/public/img/a2.jpg", "/public/img/a3.jpg"], "lat": "41.392205", "long": "2.152007" },
    { "id": '5', "type": "parking", "title": "Apartament asd", "description": "Lorem ipsum dolor sit amet, consectetur.", "mides": "1300 m2", "preu": "7000", "img": ["/public/img/a2.jpg"], "lat": "41.398205", "long": "2.151007" },

    { "id": '13', "type": "storage", "title": "Apartament Adria", "description": "Lorem ipsum dolor sit amet, consectetur.", "mides": "7000 m2", "preu": "200", "img": ["/public/img/a4.jpg"], "lat": "41.389205", "long": "2.155007" }];

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