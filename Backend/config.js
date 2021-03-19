const dotenv = require('dotenv')
dotenv.config() //Configuration dotenv pour lire le fichier .env

module.exports = {
    //Variables avec les infos du fichier .env pour pouvoir se connecter dans connection.js
    mysql_database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
}