const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');


const router = express.Router();

router.post('/register', registerUser)

router.post('/login', loginUser)


router.get('/user', validateToken, getUser)

module.exports = router