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
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ27oOKcnLPxWi6NIE37JPkhTh2rum8Auc-jI1R90lRDDjQ508J86kjJ8E4S2qYaIa9MpM&usqp=CAU'
    },
    displayName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Rating', RatingSchema)
