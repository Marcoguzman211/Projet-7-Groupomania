# Groupomania - BACKEND

## Installation de la base de données et  du serveur

 1. Créer une base de données sur MySQL appelée groupodb
 2. Importer le fichier groupodb.sql qui se trouve dans les livrables avec la méthode qui vous convient (ligne de commande, XAMPP ou autre)
 3. Copier le fichier `backend.env` dans les livrables et veuillez le placer dans le dossier `Backend` et modifiez à l'intérieur : 

> DB_USER=`votre utilisateur`
DB_PASSWORD=`le mot de passe de l'utilisateur`
DB_NAME=`nom de la base de données (si autre que groupodb)`

 4. Renommez le fichier `backend.env` en `.env`
 5. Sur la ligne des commandes et à partir du dossier `Backend` tapez:
						
		> npm install
 6. Pour lancer le serveur, à partir du dossier `Backend` sur la ligne de commandes tapez:
 
		> node server