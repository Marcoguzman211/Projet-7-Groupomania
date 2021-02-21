const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connection = require('../connection')

//Inscription de l'Utilisateur
exports.signup = (req, res, next) => {
    const user = req.body
    connection.query()
}