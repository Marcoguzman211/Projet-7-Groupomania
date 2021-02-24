const dotenv = require('dotenv')
const fs = require('fs') //Importation du package fs pour la gestion des fichiers
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const querystring = require('querystring') //Package pour parser/formater les requêtes URL

const db = require('../connection')
dotenv.config()

let decodeToken = function(req) {
    let token = req.headers.authorization.split(' ')[1]
    let decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN)
    decodedToken = [decodedToken.userId, decodedToken.access_level]
    return decodedToken
}

exports.createPublication = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]

    const titre = req.body.titre
    const description = req.body.description
    const image_url = req.body.imageUrl

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
        let imageUrl
        if (image_url) {
            imageUrl = image_url
        } else {
            imageUrl = ""
        }

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

exports.getAllPublications = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]
    const page = req.query.page
    let offset = 10

    offset = offset * (page - 1)
    let sql = "SELECT user.id, user.nom, user.prenom, publication.id, publication.titre, publication.description, publication.image_url FROM publications AS publication JOIN users AS user ON publication.user_id = user.id"
    sql = mysql.format(sql)

    const getPublications = db.query(sql, (error, publications) => {
        if (error) {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" })
        } else {
            res.status(200).json({ publications })
        }
    })
}

exports.getOnePublication = (req, res, next) => {
    const tokenInfos = decodeToken(req)
    const userId = tokenInfos[0]
    const publicationId = req.params.id

    let firstSql = "SELECT user.id, user.nom, user.prenom, publication.id, publication.titre, publication.description, publication.image_url FROM publications as publication JOIN users AS user ON publication.user_id = user.id WHERE publication.id = ? GROUP BY publication.id"
    const firstInserts = [publicationId]
    firstSql = mysql.format(firstSql, firstInserts)

    const getOnePublication = db.query(firstSql, (error, result) => {
        if (!error) {
            let publication = result;
            res.status(201).json({ publication })
        } else {
            res.status(400).json({ error: "Une erreur est survenue, aucune publication trouvée !" })
        }
    })
}