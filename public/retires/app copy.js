// appel des modules requis
const express=require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql2/promise');
const helper=require('./helper')

//pour les test
const test=require('./test')



//paramètres divers
const port = 3000;

const config_4free = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "db4free.net",
    user: "freejackjc",
    password: "Fr33jack$01-DE",
    database: "groupomaniadb_jc",
  },
  listPerPage: 10,
};

const config_local = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "localhost",
    user: "toto",
    password: "toto",
    database: "groupomaniadb",
  },
  listPerPage: 10,
};

//fonctions
let config=config_4free;
//let config=config_local;
let db=config.db;

async function query(sql, params) {
  const connection = await mysql.createConnection(db);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM users LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function getPublications(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await query(
    `SELECT * FROM publications LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(publication){
  console.log('create ', publication.title)
  let sql='INSERT INTO publications (publications_title, publications_texte, publications_author, publications_image) VALUES (?,?,?,?)'
  let result = await query(sql, [publication.title, publication.texte, publication.author, publication.imageUrl]);

  let message = 'Error in creating publication';

  if (result.affectedRows) {
    message = 'Publication created successfully';
  }

  return {message};
}




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

app.use(fileUpload())

// le code
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  console.log('ok');
});

app.get('/users', async function(req, res, next) {
  try {
    res.json(await getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
});

app.get('/publications', async function(req, res, next) {
  try {
    res.json(await getPublications(req.query.page));
  } catch (err) {
    console.error(`Error while getting publication `, err.message);
    next(err);
  }
});

app.post('/create', async function(req, res, next) {
  try {
    res.json(await create(req.body));
  } catch (err) {
    console.error(`Error while creating publication`, err.message);
    next(err);
  }
});

module.exports=app;