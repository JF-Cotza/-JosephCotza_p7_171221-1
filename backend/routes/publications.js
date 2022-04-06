//structure de base bour les futures routes
const express = require('express');
const authorization=require('../middleware/auth')
const router = express.Router();
const pubFunction=require('../controllers/publications')

//pour les test
const consoleHeader=function(req,res,next){
  console.log('consoleHeader',req.headers, req.query)
  //console.log('body',req.body)
  //console.log('file',req.files)
  //console.log(req)
  next();
}


//C
router.post('/addPublication', authorization, pubFunction.addPublication)

//R-AP : récupérer toutes les publications
router.get('/getAllPublications', authorization, pubFunction.getPublications)

//R-OP : récupérer une publication:
router.get('/getOnePublication', authorization, pubFunction.getOnePublication)

//D ; supprimer une publication
router.delete('/suppressOne', authorization, pubFunction.deleteOnePublication)




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