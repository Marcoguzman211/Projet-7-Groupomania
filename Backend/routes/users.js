const bouncer = require("express-bouncer")(500, 900000); // importation du paquet express-bouncer pour luter contre attaques par force brute
const express = require('express'); // importation du paquet express
const router = express.Router(); // création du router

const usersCtrl = require('../controllers/users')

const auth = require('../middleware/auth')
const verifyPassword = require('../middleware/verify-password')
const verifyPasswordUpdate = require('../middleware/verify-password-update')

router.post('/signup', verifyPassword, usersCtrl.signup) //Création d'un utilisateur
router.post('/login', bouncer.block, usersCtrl.login) //connexion d'un utilisateur
router.get('/:id', auth, usersCtrl.getOneUser) //Recupération d'un utilisateur
router.put('/update', auth, verifyPasswordUpdate) //Mise à jour d'un utilisateur
router.delete('/:id', auth) //supression d'un utilisateur

module.exports = router