const express = require('express')
const router = express.Router()

const { createDefaultUsers, registerUser, loginUser, getInstructor } = require('../controllers/userController')
const { preloadAssignments, getAssignments } = require('../controllers/assignmentController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', createDefaultUsers)
router.post('/login', loginUser)

// This route to be protected by inserting 'protect' as second argument

module.exports = router