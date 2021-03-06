const passwordSchema = require('../models/Password') // importation du model Password

module.exports = (req, res, next) => {
    if (!req.body.password && !req.body.newpassword) { // si newpassword et password sont vide
        next()
    } else {
        if (!passwordSchema.validate(req.body.newpassword)) { // si le mot de passe ne valide pas le schema
            res.status(400).json({ error: "Format du nouveau mot de passe incorrect, 8 caractères minimun, au moins une majuscule et au moins un chiffre" })
        } else {
            next()
        }
    }
}