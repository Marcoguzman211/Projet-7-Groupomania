const mysql = require('mysql'); // importation du paquet mysql

const db = mysql.createPool({ // création d'une pool de connexion à la base de données             
    connectionLimit: 30, // nombre maximum de création de connexion avec la base de données
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.query('SELECT 1 + 1 AS solution', function(error, results, fields) { // Test de la connexion avec la base de données
    if (error) {
        return console.error('error: ' + error.message); // Erreur de connexion
    }
    console.log("Connexion à la base de données MySQL validée !"); // Connexion validée
});

module.exports = db;