const dotenv = require('dotenv')
const validator = require('validator')
const mysql = require('mysql')
const bcrypt = require('bcrypt') //Module pour encoder les mot de passe et ne pas les enregistrer en clair dans la bdd
const jwt = require('jsonwebtoken') //Module pour générer ou gérer les tokens d'authentification

const db = require('../connection') //On appelle le fichier js qui traite la connexion à la base de données

dotenv.config()

//Fonctionalité qui decode le token envoyé par le frontend
let decodeToken = function(req) {
    let token = req.headers.authorization.split(' ')[1]
    let decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN)
    decodedToken = [decodedToken.userId, decodedToken.access_level]
    return decodedToken;
}

//Fonction pour créer un utilisateur
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
                        //On génère un token qui permet à l'utilisateur de se connecter directement lors de la création du compte
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

//Fonction pour se connecter
exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if (validator.isEmail(String(email))) {
        let sql = "SELECT id, email, password, access_level FROM users WHERE email = ?"
        let inserts = [email]
        sql = mysql.format(sql, inserts)

        const userLogin = db.query(sql, (error, user) => {
            if (error) {
                return res.status(400).json({ error: "Votre email n'est pas valide" })
            }
            if (user.length == 0) {
                return res.status(400).json({ error: "Une erreur est survenue, l'utilisateur n'a pa été trouvé." })
            }
            //Si l'utilisateur est trouvé, on compare avec bcrypt les mot de passe (frontend et bdd)
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
    } else {
        return res.status(400).json({ error: 'Votre email est invalide !' })
    }
}

//Fonction pour afficher le profil dans le frontend
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

//Fonction pour mettre à jour le profil dans la base de données
exports.updateOneUser = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]

    const nom = req.body.nom
    const prenom = req.body.prenom
    const bio = req.body.bio
    const password = req.body.password
    const newPassword = req.body.newpassword

    //Mise à jour sans nouveau mot de passe
    if (!password && !newPassword) {
        let sql = "UPDATE users SET nom = ?, prenom = ?, bio = ? WHERE id = ?"
        let inserts = [nom, prenom, bio, userId]
        sql = mysql.format(sql, inserts)

        const userUpdateWithoutNewPassword = db.query(sql, (error, result) => {
            if (error) {
                res.status(400).json({ error: "La mise à jour du profil a échouée" })
            } else {
                res.status(200).json({ message: "Les informations on été mises à jour !" })
            }
        })
    } else {
        //Fonctionalité pour mettre à jour le mot de passe de l'utilisateur
        let sql = "SELECT password FROM users WHERE id = ?"
        let inserts = [userId]
        sql = mysql.format(sql, inserts)

        const userGetPassword = db.query(sql, (error, result) => {
            if (error) {
                res.status(400).json({ error: "Une erreur est survenue, utilisateur non trouvé !" })
            } else {
                bcrypt.compare(password, result[0].password).then((valid) => {
                    if (!valid) {
                        res.status(400).json({ error: 'Mot de passe actuel invalide !' })
                    } else {
                        //Hash du nouveau mot de passe pour pas l'enregistrer en clair
                        bcrypt.hash(newPassword, 10, (error, hash) => {
                            let sql = "UPDATE users SET nom = ?, prenom = ?, bio = ?, password = ? WHERE id = ?"
                            let inserts = [nom, prenom, bio, hash, userId]
                            sql = mysql.format(sql, inserts)

                            const userUpdateWithNewPassword = db.query(sql, (error, result) => {
                                if (error) {
                                    res.status(400).json({ error: "La mise à jour du profil a échouée !" })
                                } else {
                                    res.status(200).json({ message: "Les informations, dont le mot de passe, ont été mises à jour !" })
                                }
                            })
                        })
                    }
                })
            }
        })
    }
}

//Fonction pour effacer l'utilisateur
exports.deleteOneUser = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]

    if (userId == Number(req.params.id)) {
        let sql = "DELETE from users WHERE id = ?"
        let inserts = [userId]
        sql = mysql.format(sql, inserts)

        const deleteUser = db.query(sql, (error, result) => {
            if (error) {
                res.status(400).json({ error: "Une erreur est survene, utilisateur non trouvé !" })
            } else {
                res.status(200).json({ message: "Utilisateur supprimé avec succès !" })
            }
        })
    } else {
        res.status(400).json({ error: "Action non autorisée !" })
    }
}