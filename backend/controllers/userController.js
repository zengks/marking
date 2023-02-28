const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')
// @desc Register a new user
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { lastName, firstName, email, password, isInstructor } = req.body

    // Validation
    if (!lastName || !firstName || !email || !password || !isInstructor) {
        res.status(400)
        throw new Error('Please include all fields')
    }

    // Check if user already signed up
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Create a new user
    // Hash password
    const salt = await bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the user with hashed password
    const user = await User.create({
        lastName,
        firstName,
        email,
        password: hashedPassword,
        isInstructor,
    })

    // If the user created successfully
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isInstructor: user.isInstructor,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

// @desc Login a user
// @route /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // compare hashed password to entered password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (user && isPasswordCorrect) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isInstructor: user.isInstructor,
        })
    } else {
        res.status(401)
        throw new Error('Error: Invalid credentials')
    }
})

module.exports = {
    registerUser,
    loginUser
}