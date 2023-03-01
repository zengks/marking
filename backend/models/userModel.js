const mongoose = require('mongoose')
const { Schema } = mongoose


const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    assignments: {
        type: Array,
        required: false,
        default: [],
    }

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)