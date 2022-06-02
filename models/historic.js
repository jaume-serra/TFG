const mongoose = require('mongoose')

const HistoricSchema = new mongoose.Schema({
    placeId: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
    },

    renter: {
        type: String
    },

})


module.exports = mongoose.model('Historic', HistoricSchema)