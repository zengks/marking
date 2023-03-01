const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const generateToken = require('../token/generateToken')

const User = require('../models/userModel')

const defaultUsers = require('../../defaultUsers.json')
const questions = require('../../assignments.json')

const createDefaultUsers = asyncHandler(async (req, res) => {
    const salt = await bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(defaultUsers.instructor.password, salt)

    await User.create({
        lastName: defaultUsers.instructor.lastName,
        firstName: defaultUsers.instructor.firstName,
        email: defaultUsers.instructor.email,
        password: hashedPassword,
        isAdmin: true,
    })

    for (const student of defaultUsers.students) {
        const hashedPassword = await bcrypt.hash(student.password, salt)
        await User.create({
            lastName: student.lastName,
            firstName: student.firstName,
            email: student.email,
            password: hashedPassword,
            assignments: questions,
            isAdmin: false,
        })
    }
})

// @desc Register a new user
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { lastName, firstName, email, password, isAdmin } = req.body

    // Validation
    if (!lastName || !firstName || !email || !password || !isAdmin) {
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
        isAdmin,
    })

    // If the user created successfully
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
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
            name: user.firstName + user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            assignments: user.assignments,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Error: Invalid credentials')
    }
})

// @desc Get current user
// @route /api/users/instructor
// @access Private
const getInstructor = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        isAdmin: req.user.isAdmin,
    }
    res.status(200).json(user)
})

module.exports = {
    createDefaultUsers,
    registerUser,
    loginUser,
    getInstructor,
}