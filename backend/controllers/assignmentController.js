const questions = require('../../assignments.json')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

const getAssignmentsByStudentId = asyncHandler(async (req, res) => {
    const currentStudent = await User.findById(req.params.studentId)

    if (!currentStudent) {
        res.status(404)
        throw new Error('Student not found')
    }

    if (!currentStudent.isAdmin) {
        res.status(200).json(currentStudent.assignments)
    } else {
        res.redirect(`/instructor/assignments/${req.params.studentId}`)
    }
})

module.exports = { getAssignmentsByStudentId }