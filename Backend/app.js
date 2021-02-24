require('dotenv').config()
const express = require('express') //Importation du package express
const bodyParser = require('body-parser') //BodyParser pour convertir les réponses en JSON exploitable
const path = require('path')
const helmet = require('helmet')
const sanitizeMiddleware = require('sanitize-middleware')

const usersRoutes = require('./routes/users')
const publicationsRoutes = require('./routes/publications')

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

app.use("/users", usersRoutes)
app.use("/publications", publicationsRoutes)

module.exports = app