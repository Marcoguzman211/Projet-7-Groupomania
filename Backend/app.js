require('dotenv').config()
const express = require('express') //Importation du package express
const bodyParser = require('body-parser') //BodyParser pour convertir les réponses en JSON exploitable
const path = require('path')
const helmet = require('helmet')
const sanitizeMiddleware = require('sanitize-middleware')

const app = express()
app.use(helmet())

// middleware général appliqué à toute les requêtes (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app