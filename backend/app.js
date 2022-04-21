// appel des modules requis
const express=require('express');
const path = require('path'); // donne accés au systeme de fichier
const helper=require('./helper')

const fileUpload = require('express-fileupload');

//pour les requêtes
const query=require('./query');

//pour les routes
const connect=require('./routes/connect');
const user=require('./routes/user');
const commentRt=require('./routes/comment');
const publication=require('./routes/publications');
const admin=require('./routes/admin');

//paramètres divers
const port = 3000;

//fonctions

let config=connect;
let db=config.db;

//création de l'app
const app=express();

//pour éviter les problèmes de Cross Origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// le code
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/');
app.use('/images', express.static(path.join(__dirname, 'images'))); //Attention, à ne pas oublier sinon le front ne peut pas accéder au répertoire image

app.use(fileUpload())



app.use('/api/auth', user);
app.use('/api/publications', publication);
app.use('/api/comments', commentRt)
app.use('/api/admin',admin)

module.exports=app;