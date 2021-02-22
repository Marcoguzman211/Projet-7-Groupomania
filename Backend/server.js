const http = require('http') //Importation du package http de node
const app = require('./app')

app.set('port, 3000') //Utilisé par express
const server = http.createServer(app)

server.listen(3000, console.log('Serveur connecté')) //Serveur en écoute