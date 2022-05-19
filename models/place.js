const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "storage"
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    measures: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        default: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ27oOKcnLPxWi6NIE37JPkhTh2rum8Auc-jI1R90lRDDjQ508J86kjJ8E4S2qYaIa9MpM&usqp=CAU']
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    country: {
        type: String
    },
    countryCode: {
        type: String
    },
    zipCode: {
        type: String
    },
    city: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deletedAT: {
        type: Date
    },

    active: {
        type: Boolean,
        default: false
    },

    renter: {
        type: String
    }
})


module.exports = mongoose.model('Place', PlaceSchema)