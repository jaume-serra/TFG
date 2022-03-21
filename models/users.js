const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String
    },
    email: {   //FIXME: Posar type email?
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ27oOKcnLPxWi6NIE37JPkhTh2rum8Auc-jI1R90lRDDjQ508J86kjJ8E4S2qYaIa9MpM&usqp=CAU'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    password: {
        type: String,
    },
    deletedAT: {
        type: Date
    }
})


module.exports = mongoose.model('User', UserSchema)