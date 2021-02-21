const mysql = require('mysql')
const {mysql_database} = require('./config')

const connection = mysql.createConnection(mysql_database)

connection.connect((err, conn) => {
    if (err) {
        console.log('Impossible de se connecter à la base de données')
    } else {
        console.log('Connecté à la base de données MySQL!')
        return conn
    }
})

module.exports = connection