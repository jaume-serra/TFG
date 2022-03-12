/* const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema({

    email: {   
        type: String,
        required: true,
        unique: true
    },

    image: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ27oOKcnLPxWi6NIE37JPkhTh2rum8Auc-jI1R90lRDDjQ508J86kjJ8E4S2qYaIa9MpM&usqp=CAU'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deletedAT:{
        type: Date
    }
})


module.exports = mongoose.model('Place', PlaceSchema) */