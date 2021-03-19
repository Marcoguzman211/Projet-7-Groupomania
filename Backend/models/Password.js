const passwordValidator = require('password-validator')

const passwordSchema = new passwordValidator()

//Définition du schema à respecter pour créer un mot de passe avec le module password-validator
passwordSchema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123'])

module.exports = passwordSchema