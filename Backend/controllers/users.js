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
            let inserts = [nom, prenom, email, hash, bio]
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
exports.login = (req, res, next) => {
    const email = req.body.email,
        password = req.body.password

    if (validator.isEmail(String(email))) {
        let sql = "SELECT id, email, password, access_level FROM users WHERE email = ?"
        let inserts = [email]
        sql = mysql.format(sql, inserts)

        const userLogin = db.query(sql, (error, user) => {
            if (error) {
                return res.status(400).json({ error: "Votre email n'est pas valide" })
            }
            if (user.lenght == 0) {
                res.status(400).json({ eror: "Une erreur est survenue, l'utilisateur n'a pa été trouvé." })
            }
            bcrypt.compare(password, user[0].password).then((valid) => {
                if (!valid) {
                    return res.status(400).json({ error: "Mot de passe invalide !" })
                }
                res.status(200).json({
                    message: "Vous êtes maintenant connecté!",
                    token: jwt.sign({ userId: user[0].id, access_level: user[0].access_level },
                        process.env.JWT_AUTH_SECRET_TOKEN, { expiresIn: process.env.JWT_EXPIRATION }
                    )
                })
            })
        })
    }
}

exports.getOneUser = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]

    if (userId == Number(req.params.id)) {
        let sql = "SELECT nom, prenom, email, bio FROM users WHERE id = ?"
        let inserts = userId
        sql = mysql.format(sql, inserts)

        const getUserInfos = db.query(sql, (error, result) => {
            if (error) {
                res.status(400).json({ error: "Utilisateur non trouvé" })
            }
            if (result.lenght == 0) {
                res.status(400).json({ error: "Utilisateur non trouvé" })
            }
            res.status(200).json(result[0])
        })
    } else {
        res.status(401).json({ error: "Action non autorisée !" })
    }

}