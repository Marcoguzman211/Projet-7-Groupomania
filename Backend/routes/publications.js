const express = require('express')
const router = express.Router()

const publiCrtl = require('../controllers/publications')

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, publiCrtl.createPublication)
router.get('/', auth, publiCrtl.getAllPublications)
router.get('/:id', auth, publiCrtl.getOnePublication)

module.exports = router