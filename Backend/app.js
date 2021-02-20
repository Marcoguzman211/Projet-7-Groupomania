const express = require('express') //On importe express
const bodyParser = require('body-parser') //Package pour transformer le corps de requêtes
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const dotenv = require('dotenv')
const mysql = require('mysql')

dotenv.config()

const app = express()

//Ajout des Headers à la requête pour éviter le CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
})

const db = mysql.createConnection({

    host: "localhost",

    user: "groupomania",

    password: "OcrAccess7"

});

db.connect(function(err) {

    if (err) throw err;

    console.log("Connecté à la base de données MySQL!");

});

module.exports = app