const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

const getAllStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ isAdmin: false })

    if (students) {
        res.status(200).json(students)
    } else {
        res.status(400)
        throw new Error('No students found.')
    }
})

const viewAssignmentsByStudentId = asyncHandler(async (req, res) => {
    const selectedStudent = await User.findById(req.params.studentId)

    if (!selectedStudent) {
        res.status(404)
        throw new Error('Selected student is not found.')
    }

    if (!selectedStudent.isAdmin) {
        res.status(200).json(selectedStudent.assignments)
    }

})

module.exports = {
    getAllStudents,
    viewAssignmentsByStudentId,
}