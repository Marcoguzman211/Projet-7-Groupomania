const express = require('express') //On importe express
const bodyParser = require('body-parser') //Package pour transformer le corps de requêtes
const path = require('path')
const connection = require('./connection')
const helmet = require('helmet')
const dotenv = require('dotenv')
const mysql = require('mysql')

const usersRoutes = require('./routes/users')
dotenv.config()

const app = express()

app.use(helmet())

//Ajout des Headers à la requête pour éviter le CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
})
app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/', usersRoutes)

module.exports = app