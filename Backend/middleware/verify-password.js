const passwordSchema = require('../models/Password')

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ error: "Format du nouveau mot de passe incorrect, 8 caractères minimun, au moins une majuscule et au moins un chiffre" })
    } else {
        next()
    }
}