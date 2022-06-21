// // const { response } = require('express');
const express = require('express');

const router = express.Router();

const apiControler = require('../controller/api');


router.get('/get_places', apiControler.getPlaces); 



module.exports = router;