const mysql = require('mysql')
const { mysql_database } = require('./config')
const { connect } = require('./routes/publications')

const connection = mysql.createConnection(mysql_database)

connection.connect((err, conn) => {
    if (err) {
        console.error('error: ' + err.message)
    } else {
        console.log('Connexion à la base des données MySQL réussie !')
        return conn
    }
})