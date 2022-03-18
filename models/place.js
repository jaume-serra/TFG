const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema({

    email: {   
        type: String,
        required: true,
        unique: true
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
    image: {
        type: Array,
        default: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ27oOKcnLPxWi6NIE37JPkhTh2rum8Auc-jI1R90lRDDjQ508J86kjJ8E4S2qYaIa9MpM&usqp=CAU']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deletedAT:{
        type: Date
    }
})


module.exports = mongoose.model('Place', PlaceSchema)