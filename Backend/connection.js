const mysql = require("mysql2")
const { mysql_database } = require('./config')

//Création de la connexion avec le module mysql2 avec l'objet créé dans config.js
const db = mysql.createConnection(mysql_database)

//Connexion à la base de donnes
db.connect((err, conn) => {
    if (err) {
        console.error('error: ' + err.message)
    } else {
        console.log('Connexion à la base des données MySQL réussie !')
        return conn
    }
})

module.exports = db