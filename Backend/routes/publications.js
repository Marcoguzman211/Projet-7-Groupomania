const express = require('express')
const router = express.Router()

const publiCrtl = require('../controllers/publications')

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, publiCrtl.createPublication)
router.get('/', auth, publiCrtl.getAllPublications)
router.get('/:id', auth, publiCrtl.getOnePublication)
router.delete('/:id', auth, publiCrtl.deletePublication)
router.post('/commentaire', auth, publiCrtl.commentPublication)
router.delete('/commentaire/:id', auth, publiCrtl.deleteComment)

module.exports = router