# grpform
A) Télécharger le paquet :
https://github.com/JF-Cotza/-JosephCotza_p7_171221-1 
soit sous forme d’un zip soit à l’aide d’un git pull
→ extraire les fichiers du zip si c’est cette option qui a été choisie.

B) répertoire structureDB : 
il contient la structure de base de la base de donnée avec l’administrateur par défaut ci-dessous:

administrateur par défaut
mail : defaultAdmin@defaultAdmin.com
mot de passe : d3f@ultAdm1n

## Project setup & Compiles and hot-reloads for development
C) Lors de la création du projet : 
    1. se connecter à phpMyAdmin
    2. importer la base de donnée contenu dans le fichier groupomaniadb.sql
    3. supprimer le répertoire structureDB 
    4. Aller dans le répertoire d’installation :
    1. dans le terminal 
        1. lancer : npm install pour installer les paquets de node manquants
        2. une fois cela fait lancer : npm run serve
    2. dans un autre terminal
        1. aller dans le répertoire backend
        2. lancer : npm install pour installer les paquets de node manquants
        3. lancer ensuite soit : nodemon server , soit :npm run serve

D)Fichier .env
	Renommer le fichier .env_template en .env

E) Configuration du port backend
	Cela doit être la même valeur dans le frontend et le backend
- dans le frontend : Dans le fichier:src/store/index.js : modifier la valeur de port. 
- dans le backend : dans le fichier : backend/.env  modifier la valeur contenu dans connecting_port

F) Configuration d’accés à la base de donnée :
	Dans le fichier : backend/.env modifier les valeurs commençant par db_

G) Paramètres du token
	Toujours dans le fichier : backend/.env modifier les valeurs token et token_end

H) La valeur listPerPage
	dans le fichier :  backend/.env, listPerPage accepte une valeur numérique uniquement. C’est le nombre de publications qui seront affichées sur la page d’accueil connectée. 

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
