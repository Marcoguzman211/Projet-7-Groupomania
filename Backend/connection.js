const mysql = require("mysql2")
const { mysql_database } = require('./config')

const db = mysql.createConnection(mysql_database)

db.connect((err, conn) => {
    if (err) {
        console.error('error: ' + err.message)
    } else {
        console.log('Connexion à la base des données MySQL réussie !')
        return conn
    }
})

module.exports = db