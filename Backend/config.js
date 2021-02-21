const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    mysql_database: {
        host: 'localhost',
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
}