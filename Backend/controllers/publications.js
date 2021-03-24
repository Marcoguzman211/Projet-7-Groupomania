const dotenv = require('dotenv')
const fs = require('fs') //Importation du package fs pour la gestion des fichiers
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

const db = require("../connection")
dotenv.config()

//Fonctionalité qui decode le token envoyé par le frontend
let decodeToken = function(req) {
    let token = req.headers.authorization.split(' ')[1]
    let decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN)
    decodedToken = [decodedToken.userId, decodedToken.access_level]
    return decodedToken
}

//Fonctionalité pour créer une publication
exports.createPublication = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]

    const titre = req.body.titre
    const description = req.body.description
    const image_url = req.body.imageUrl

    //Si l'utilisateur met en ligne une image on la stocke dans le dossier images
    if (req.file != undefined) {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        let sql = "INSERT INTO publications (user_id, titre, description, image_url) VALUES (?,?,?,?)"
        let inserts = [userId, titre, description, imageUrl]
        sql = mysql.format(sql, inserts)

        const publicationCreate = db.query(sql, (error, publication) => {
            if (!error) {
                res.status(201).json({ message: "La publication a été enregistrée !" })
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été créée" })
            }
        })
    } else {
        //Sinon on laisse à vide l'image_url dans la bdd
        let imageUrl = ''

        let sql = "INSERT INTO publications (user_id, titre, description, image_url) VALUES (?, ?, ?, ?)"
        let inserts = [userId, titre, description, imageUrl]
        sql = mysql.format(sql, inserts)


        const publicationCreate = db.query(sql, (error, publication) => {
            if (!error) {
                res.status(201).json({ message: "La publication a été enregistrée !" })
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été créée" })
            }
        })
    }
}

//Fonctionalité pour MODIFIER une publication
exports.updatePublication = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]

    const publicationId = req.body.publicationId
    const titre = req.body.titre
    const description = req.body.description
    const image_url = req.body.imageUrl

    //Si l'utilisateur met en ligne une image on la stocke dans le dossier images
    if (req.file != undefined) {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        let sql = "UPDATE publications SET titre = ?, description = ?, image_url = ? WHERE id = ?"
        let inserts = [titre, description, imageUrl, publicationId]
        sql = mysql.format(sql, inserts)

        const publicationCreate = db.query(sql, (error, publication) => {
            if (!error) {
                res.status(201).json({ message: "La publication a été modifiée !" })
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été modifiée !" })
            }
        })
    } else {
        //Sans nouvelle image
        let sql = "UPDATE publications SET titre = ?, description = ? WHERE id = ?"
        let inserts = [titre, description, publicationId]
        sql = mysql.format(sql, inserts)


        const publicationCreate = db.query(sql, (error, publication) => {
            if (!error) {
                res.status(201).json({ message: "La publication a été modifiée !" })
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été modifié" })
            }
        })
    }
}

//Fonction pour envoyer toutes les publications de la base de données au frontend, rangés par date de publication
exports.getAllPublications = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]
    const page = req.query.page

    let sql = "SELECT user.id, user.nom, user.prenom, publication.id, publication.titre, publication.description, publication.image_url, publication.creation_date FROM publications AS publication JOIN users AS user ON publication.user_id = user.id ORDER BY publication.creation_date DESC"
    sql = mysql.format(sql)

    const getPublications = db.query(sql, (error, publications) => {
        if (error) {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" })
        } else {
            res.status(200).json({ publications })
        }
    })
}

//Fonction pour afficher la publication choisie dans le Home coté frontend avec les paramètres de l'URL
exports.getOnePublication = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]
    const publicationId = req.params.id

    let firstSql = "SELECT user.id, user.nom, user.prenom, publication.id, publication.user_id, publication.titre, publication.description, publication.image_url, publication.creation_date FROM publications as publication JOIN users AS user ON publication.user_id = user.id WHERE publication.id = ? GROUP BY publication.id"
    let secondSql = 'SELECT user.id, user.nom, user.prenom, commentaire.id, commentaire.user_id, commentaire.creation_date, commentaire.message FROM commentaires AS commentaire JOIN users AS user ON commentaire.user_id = user.id WHERE publication_id = ? GROUP BY commentaire.id ORDER BY commentaire.creation_date'

    const firstInserts = [publicationId]
    firstSql = mysql.format(firstSql, firstInserts)

    const secondInserts = [publicationId]
    secondSql = mysql.format(secondSql, secondInserts)

    const getOnePublication = db.query(firstSql, (error, result) => {
        if (!error) {
            let publication = result;
            const getOnePublicationCommentaires = db.query(secondSql, (error, result) => {
                if (!error) {
                    const commentaires = result
                    const finalResponse = {
                        publication: publication,
                        commentaires: commentaires
                    }
                    res.status(201).json(finalResponse)
                }
            })
        } else {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" })
        }
    })
}

exports.commentPublication = (req, res, next) => {

    const tokenInfos = decodeToken(req) // on utilise la fonction decodeToken
    const userId = tokenInfos[0] // on obtient le UserId du token

    const publicationId = req.body.publicationId // on récupère l'id de la publication
    const message = req.body.message // on extrait le message du commentaire

    let sql = "INSERT INTO commentaires (user_id, publication_id, message) VALUES (?, ?, ?)" // préparation de la requete SQL
    let inserts = [userId, publicationId, message] // utilisation des valeurs à insérer
    sql = mysql.format(sql, inserts) // assemblage final de la requête

    const commentaireCreate = db.query(sql, (error, result) => { // envoi de la requête a la base de données
        if (!error) {
            res.status(201).json({ message: "Le commentaire a bien été créé" })
        } else {
            res.status(400).json({ message: "Une erreur est survenue, le commentaire n'a pas été créé" })
        }
    })
}

exports.deleteComment = (req, res, next) => {

    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0] // on obtient le UserId du token
    const access_level = tokenInfos[1] // on obtient le niveau d'acces du token

    const commentaireId = req.params.id // on récupère l'id du commentaire

    if (access_level === 1) { // si le niveau d'acces est 1 (Modérateur)
        let sql = "DELETE FROM commentaires WHERE id = ?" // préparation de la requete SQL
        let inserts = [commentaireId] // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts) // assemblage final de la requête
        let role = "Modérateur"

        const commentaireDelete = db.query(sql, (error, result) => { // envoi de la requête a la base de données
            if (!error) {
                res.status(200).json({ message: "Le commentaire a été supprimé !" + " (" + role + ")" })
            } else {
                res.status(400).json({ message: "Une erreur est survenue, le commentaire n'a pas été supprimé" })
            }
        });
    } else {
        let sql = "DELETE FROM commentaires WHERE id = ? AND user_id = ?"
        let inserts = [commentaireId, userId] // utilisation des valeurs à insérer
        sql = mysql.format(sql, inserts) // assemblage final de la requête
        let role = "Utilisateur"

        const commentaireDelete = db.query(sql, (error, result) => { // envoi de la requête a la base de données
            if (!error) {
                if (result.affectedRows === 0) {
                    res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer ce commentaire !" })
                } else {
                    res.status(200).json({ message: "Le commentaire a été supprimé !" + " (" + role + ")" })
                }
            } else {
                res.status(400).json({ message: "Une erreur est survenue, le commentaire n'a pas été supprimé" })
            }
        })
    }
}

//Fonction pour effacer une publication avec les notions de modérateur et utilisateur commun
exports.deletePublication = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]
    const access_level = tokenInfos[1]
    const publicationId = req.params.id

    if (access_level === 1) { //Quand l'utilisateur est un modérateur
        let firstSql = "SELECT image_url FROM publications WHERE id = ?"
        let secondSql = "DELETE FROM publications WHERE id = ?"
        let inserts = [publicationId]
        firstSql = mysql.format(firstSql, inserts)
        secondSql = mysql.format(secondSql, inserts)
        let role = "Modérateur"

        const publicationImageUrl = db.query(firstSql, (error, image) => {
            if (!error) {
                if (image[0].image_url.startsWith('http://localhost:3000')) {
                    const filename = image[0].image_url.split("/images/")[1]
                    fs.unlink(`images/${filename}`, () => {})
                }
                const publicationDelete = db.query(secondSql, (error, result) => {
                    if (!error) {
                        if (result.affectedRows === 0) {
                            res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer cette publication" })
                        } else {
                            res.status(200).json({ message: "La publication a été supprimé !" + "(" + role + ")" })
                        }
                    } else {
                        res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été supprimé" })
                    }
                })
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été trouvée" })
            }
        })
    } else { //Quand l'utilisateur est seulement propietaire de la publication
        let firstSql = "SELECT image_url FROM publications WHERE id = ?"
        let secondSql = "DELETE FROM publications WHERE id = ? AND user_id = ?"
        let firstInserts = [publicationId]
        let secondInserts = [publicationId, userId]
        firstSql = mysql.format(firstSql, firstInserts)
        secondSql = mysql.format(secondSql, secondInserts)
        let role = "Utilisateur"

        const publicationImageUrl = db.query(firstSql, (error, image) => {
            if (!error) {
                if (image[0].image_url.startsWith('http://localhost:3000')) {
                    const filename = image[0].image_url.split("/images/")[1]
                    fs.unlink(`images/${filename}`, () => {})
                }
                const publicationDelete = db.query(secondSql, (error, result) => {
                    if (!error) {
                        if (result.affectedRows === 0) {
                            res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer cette publication" })
                        } else {
                            res.status(200).json({ message: "La publication a été supprimé !" + "(" + role + ")" })
                        }
                    } else {
                        res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été supprimé" })
                    }
                })
            } else {
                res.status(400).json({ message: "Une erreur est survenue, la publication n'a pas été trouvée" })
            }
        })
    }
}