const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        default: null
    },
    email: {   //FIXME: Posar type email?
        type: String,
        required: true
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
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    password: {
        type:String,
        required: true
    },
    deletedAT:{
        type: Date
    }
})


module.exports = mongoose.model('User', UserSchema)