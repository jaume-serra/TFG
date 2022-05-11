const mongoose = require('mongoose')

const RatingSchema = new mongoose.Schema({
    idPlace: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

    stars: {
        type: Number,
        required: true
    },
    description: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Rating', RatingSchema)
