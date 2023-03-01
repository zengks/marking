const express = require('express')
const router = express.Router()

const { getAssignmentsByStudentId } = require('../controllers/assignmentController')

router.get('/:studentId', getAssignmentsByStudentId)

module.exports = router