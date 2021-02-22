require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_AUTH_SECRET_TOKEN)
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            res.status(401).json({ error: "Requête non autorisée !" })
        } else {
            next()
        }
    } catch {
        res.status(401).json({ error: "Requête non authentifiée !" }) // si une erreur est reçu on l'affiche, sinon on affiche le message personnalisé
    }
};