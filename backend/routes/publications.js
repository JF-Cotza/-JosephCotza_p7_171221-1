//structure de base bour les futures routes
const express = require('express');
const router = express.Router();
const pubFunction=require('../controllers/publications')


//C
router.post('/addPublication', async function(req, res) {
    let body=req.body;
  try {
    res.json(await pubFunction.addPublication(body))
  } catch (err) {
    console.error(`Error while adding publication `, err.message);
  }
  
  
});

//R
router.get('/getAllPublications', async function(req, res, next) {
  try {
    res.json(await pubFunction.getAllPublications(req.query.page));
  } catch (err) {
    console.error(`Error while getting pubs `, err.message);
    next(err);
  }
});

/*
router.get('/oneUser', async function(req, res, next) {
  try {
    res.json(await userFunction.getOneUser(req.query.page));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

//U
router.put('/updateUser', async function(req, res) {
  let body=req.body;
  console.log('update', body)  
  try {
    res.json(await userFunction.updateUser(body));
  } catch (err) {
    console.error(`Error while adding user `, err.message);
  }
  //window.location.href('http://localhost:8000/test/?ok=ok')
  //res.redirect('http://localhost:8000/test/?ok=ok')
});

//D
router.delete('/suppressUser', async function(req, res) {
  let body=req.body;
  console.log('suppression', body)  
  try {
    res.json(await userFunction.suppressUser(body));
  } catch (err) {
    console.error(`Error while suppress user `, err.message);
  }
  //window.location.href('http://localhost:8000/test/?ok=ok')
  //res.redirect('http://localhost:8000/test/?ok=ok')
});


*/

module.exports = router;