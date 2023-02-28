const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getInstructor } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)

// This route to be protected by inserting 'protect' as second argument
router.get('/instructor', protect, getInstructor)

module.exports = router