// appel des modules requis
const express=require('express');
const helper=require('./helper')

const fileUpload = require('express-fileupload');

//pour les requêtes
const query=require('./query');

//pour les routes
const connect=require('./routes/connect');
const user=require('./routes/user');
const publication=require('./routes/publications');


//paramètres divers
const port = 3000;


//fonctions

let config=connect;
let db=config.db;

// test
//let publication=test.publication

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

app.use(fileUpload())

app.use('/api/auth', user);
app.use('/api/publications', publication);

app.get("/", (req, res) => {
  console.log('ok');
});

module.exports=app;