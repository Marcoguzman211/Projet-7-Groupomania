const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    mysql_database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
}