const { Error } = require('mongoose');
const User = require('../models/users')

/* const connectDB = require('../config/db');
connectDB()
 */

const postCreatePlace = (req, res) => {
    res.render ("place/create_place")
}




module.exports = { postCreatePlace }