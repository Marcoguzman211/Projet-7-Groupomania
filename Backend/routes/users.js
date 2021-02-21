const express = require('express')
const router = express.Router()
const usersCtlr = require('../controllers/users')


router.post('/signup', usersCtlr.signup);

module.exports = router
