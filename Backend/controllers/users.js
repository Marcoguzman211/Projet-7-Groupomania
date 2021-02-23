const dotenv = require('dotenv')
const validator = require('validator')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../connection')

dotenv.config()

let decodeToken = function(req) {
    let token = req.headers.authorization.split(' ')[1]
    let decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN)
    decodedToken = [decodedToken.userId, decodedToken.access_level]
    return decodedToken;
}

exports.signup = (req, res, next) => {
    const nom = req.body.nom,
        prenom = req.body.prenom,
        email = req.body.email,
        password = req.body.password,
        bio = req.body.bio

    if (validator.isEmail(String(email))) {
        bcrypt.hash(password, 10, (error, hash) => {
            let sql = "INSERT INTO users (nom, prenom, email, password, bio) VALUES (?,?,?,?,?)"
            let inserts = [nom, prenom, email, password, bio]
            sql = mysql.format(sql, inserts)

            const usersSignup = db.query(sql, (error, user) => {
                if (!error) {
                    res.status(201).json({
                        message: "L'utilisateur a été créé avec succès",
                        token: jwt.sign({ userId: user.insertId, access_level: 0 },
                            process.env.JWT_AUTH_SECRET_TOKEN, { expiresIn: process.env.JWT_EXPIRATION }
                        )
                    })
                } else {
                    return res.status(409).json({ error: "Cet utilisateur existe déjà !" })
                }
            })
        })
    } else {
        return res.status(400).json({ error: "Votre email est invalide !" })
    }
}