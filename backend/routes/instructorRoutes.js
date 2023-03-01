const express = require('express')
const router = express.Router()

const { getAllStudents, viewAssignmentsByStudentId } = require('../controllers/instructorController')

router.get('/assignments/', getAllStudents)
router.get('/assignments/:studentId', viewAssignmentsByStudentId)

module.exports = router